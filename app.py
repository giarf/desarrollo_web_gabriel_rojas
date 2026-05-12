import os
import uuid

from flask import Flask, flash, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename

from database import db
from utils.validations import validate_activities, validate_member


UPLOAD_FOLDER = os.path.join("static", "uploads")
PAGE_SIZE = 5

app = Flask(__name__)
app.secret_key = "tarea2_secret_key"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1000 * 1000


def save_activity_photos(activities):
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    for activity in activities:
        saved_photos = []
        for photo in activity["fotos"]:
            filename = secure_filename(photo.filename)
            extension = filename.rsplit(".", 1)[-1].lower()
            stored_name = f"{uuid.uuid4()}.{extension}"
            photo.save(os.path.join(app.config["UPLOAD_FOLDER"], stored_name))
            saved_photos.append({
                "ruta_archivo": app.config["UPLOAD_FOLDER"],
                "nombre_archivo": stored_name,
            })
        activity["fotos"] = saved_photos


@app.route("/", methods=["GET"])
def index():
    miembros = db.get_last_members(5)
    return render_template("index.html", miembros=miembros)


@app.route("/registrar", methods=["GET", "POST"])
def registrar():
    comunas = db.get_comunas()
    if request.method == "GET":
        return render_template("registrar.html", comunas=comunas, errors=[])

    nombre = request.form.get("nombre", "").strip()
    email = request.form.get("email", "").strip()
    telefono = request.form.get("telefono", "").strip()
    comuna_id = request.form.get("comuna_id", "")

    errors = validate_member(nombre, email, telefono, comuna_id)
    if comuna_id and comuna_id.isdigit() and not db.get_comuna_by_id(int(comuna_id)):
        errors.append("La comuna seleccionada no existe.")

    activity_errors, activities = validate_activities(request.form, request.files)
    errors.extend(activity_errors)

    if errors:
        return render_template("registrar.html", comunas=comunas, errors=errors, form=request.form)

    save_activity_photos(activities)
    db.create_member_with_activities(
        {
            "nombre": nombre,
            "email": email,
            "telefono": telefono,
            "comuna_id": int(comuna_id),
        },
        activities,
    )
    flash("Miembro y actividades registrados correctamente.")
    return redirect(url_for("index"))


@app.route("/miembros", methods=["GET"])
def miembros():
    page = request.args.get("page", "1")
    page = int(page) if page.isdigit() and int(page) > 0 else 1
    total = db.count_members()
    total_pages = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)
    page = min(page, total_pages)
    miembros_page = db.get_members_page(page, PAGE_SIZE)
    return render_template(
        "miembros.html",
        miembros=miembros_page,
        page=page,
        total_pages=total_pages,
    )


@app.route("/miembros/<int:member_id>", methods=["GET"])
def detalle_miembro(member_id):
    miembro = db.get_member_detail(member_id)
    if not miembro:
        flash("El miembro solicitado no existe.")
        return redirect(url_for("miembros"))
    return render_template("detalle_miembro.html", miembro=miembro)


@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("estadisticas.html")


if __name__ == "__main__":
    app.run(debug=True)
