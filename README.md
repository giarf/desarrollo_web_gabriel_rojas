# Tarea 2 - Actividades DCC

Aplicacion Flask para registrar miembros y actividades usando MySQL y SQLAlchemy.

## Base de datos

La aplicacion usa las credenciales pedidas en el enunciado:

- host: `localhost`
- puerto: `3306`
- base de datos: `tarea2`
- usuario: `cc5002`
- password: `programacionweb`

Para crear tablas y cargar comunas/regiones:

```bash
mysql -u cc5002 -p < tarea2.sql
mysql -u cc5002 -p tarea2 < region-comuna.sql
```

Si se trabaja con una base remota, se espera tener un reenvio de puerto local para que `localhost:3306` apunte al MySQL remoto.

## Ejecucion

```bash
pip install -r requirements.txt
python app.py
```

La aplicacion guarda las fotos subidas en `static/uploads/`, carpeta ignorada por Git.

## Decisiones

- Se reutilizo la estructura simple de las auxiliares con `database/db.py`, `SessionLocal` y modelos SQLAlchemy.
- El formulario de registro une miembro, actividades y fotos porque el enunciado pide registrar miembro y actividades en un mismo flujo.
- Las estadisticas quedan como vista pendiente, segun indica el enunciado.
