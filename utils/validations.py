import re

import filetype


VALID_DAYS = {"lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"}
VALID_TYPES = {"arte", "deporte", "tecnología", "social", "recreación", "otra"}
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}
ALLOWED_MIMETYPES = {"image/png", "image/jpeg", "image/gif", "image/webp"}


def validate_member(nombre, email, telefono, comuna_id):
    errors = []
    if not nombre or len(nombre.strip()) < 3 or len(nombre.strip()) > 255:
        errors.append("Nombre invalido.")
    if not email or len(email) > 80 or not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        errors.append("Correo invalido.")
    if not telefono or len(telefono) > 15 or not re.match(r"^[0-9]{8,15}$", telefono):
        errors.append("Telefono invalido.")
    if not comuna_id or not str(comuna_id).isdigit():
        errors.append("Debe seleccionar una comuna.")
    return errors


def validate_photo(photo):
    if photo is None or photo.filename == "":
        return "Debe agregar al menos una foto por actividad."

    file_type = filetype.guess(photo)
    photo.seek(0)
    if file_type is None or file_type.extension not in ALLOWED_EXTENSIONS or file_type.mime not in ALLOWED_MIMETYPES:
        return "Las fotos deben ser imagenes png, jpg, jpeg, gif o webp."
    return None


def validate_activities(form, files):
    errors = []
    names = form.getlist("actividad_nombre[]")
    days = form.getlist("dia[]")
    starts = form.getlist("hora_inicio[]")
    durations = form.getlist("duracion[]")
    types = form.getlist("tipo[]")
    descriptions = form.getlist("descripcion[]")

    if not names:
        return ["Debe registrar al menos una actividad."], []

    activities = []
    for index, name in enumerate(names):
        activity_number = index + 1
        name = name.strip()
        day = days[index] if index < len(days) else ""
        start = starts[index] if index < len(starts) else ""
        duration = durations[index] if index < len(durations) else ""
        activity_type = types[index] if index < len(types) else ""
        description = descriptions[index].strip() if index < len(descriptions) else ""
        photos = files.getlist(f"foto_{index}[]")
        valid_photos = []

        if len(name) < 3 or len(name) > 45:
            errors.append(f"Actividad {activity_number}: nombre invalido.")
        if day not in VALID_DAYS:
            errors.append(f"Actividad {activity_number}: dia invalido.")
        if not re.match(r"^([01][0-9]|2[0-3]):[0-5][0-9]$", start):
            errors.append(f"Actividad {activity_number}: hora de inicio invalida.")
        if not re.match(r"^[0-9]{1,2}:[0-5][0-9]$", duration):
            errors.append(f"Actividad {activity_number}: duracion invalida, use HH:MM.")
        if activity_type not in VALID_TYPES:
            errors.append(f"Actividad {activity_number}: tipo invalido.")
        if len(description) > 500:
            errors.append(f"Actividad {activity_number}: descripcion demasiado larga.")

        for photo in photos:
            photo_error = validate_photo(photo)
            if photo_error:
                errors.append(f"Actividad {activity_number}: {photo_error}")
            else:
                valid_photos.append(photo)

        if not valid_photos:
            errors.append(f"Actividad {activity_number}: debe agregar al menos una foto valida.")

        activities.append({
            "nombre": name,
            "dia": day,
            "hora_inicio": start,
            "duracion": duration,
            "tipo": activity_type,
            "descripcion": description,
            "fotos": valid_photos,
        })

    return errors, activities


def validate_comment(nombre, texto):
    errors = []
    nombre = nombre.strip() if nombre else ""
    texto = texto.strip() if texto else ""

    if len(nombre) < 3 or len(nombre) > 80:
        errors.append("El nombre debe tener entre 3 y 80 caracteres.")
    if len(texto) < 5 or len(texto) > 300:
        errors.append("El comentario debe tener entre 5 y 300 caracteres.")

    return errors
