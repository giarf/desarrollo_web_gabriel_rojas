import os
import uuid

import filetype
from flask import Flask, flash, jsonify, redirect, render_template, request, url_for

from database import db
from utils.validations import validate_activities, validate_comment, validate_member


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
            file_type = filetype.guess(photo)
            photo.seek(0)
            extension = file_type.extension
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


@app.route("/api/estadisticas/miembros-por-dia", methods=["GET"])
def estadisticas_miembros_por_dia():
    return jsonify(db.get_members_by_day_stats())


@app.route("/api/estadisticas/actividades-por-tipo", methods=["GET"])
def estadisticas_actividades_por_tipo():
    return jsonify(db.get_activities_by_type_stats())


@app.route("/api/estadisticas/actividades-por-comuna", methods=["GET"])
def estadisticas_actividades_por_comuna():
    return jsonify(db.get_activities_by_comuna_stats())


@app.route("/api/actividades/<int:activity_id>/comentarios", methods=["GET"])
def comentarios_actividad(activity_id):
    if not db.get_activity_by_id(activity_id):
        return jsonify({"status": "error", "errors": ["La actividad no existe."]}), 404
    return jsonify({"status": "ok", "data": db.get_comments_by_activity(activity_id)})


@app.route("/api/actividades/<int:activity_id>/comentarios", methods=["POST"])
def agregar_comentario(activity_id):
    if not db.get_activity_by_id(activity_id):
        return jsonify({"status": "error", "errors": ["La actividad no existe."]}), 404

    data = request.get_json(silent=True) or {}
    nombre = data.get("nombre", "").strip()
    texto = data.get("texto", "").strip()
    errors = validate_comment(nombre, texto)
    if errors:
        return jsonify({"status": "error", "errors": errors}), 400

    comment = db.create_comment(activity_id, nombre, texto)
    return jsonify({"status": "ok", "data": comment}), 201


if __name__ == "__main__":
    app.run(debug=True)
