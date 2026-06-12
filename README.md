# Tarea 3 - Actividades DCC

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
mysql -u cc5002 -p tarea2 < tabla-comentario.sql
```

## Ejecucion

```bash
pip install -r requirements.txt
python app.py
```

La aplicacion guarda las fotos subidas en `static/uploads/`, carpeta ignorada por Git.

## Estadisticas y comentarios

La pantalla `/estadisticas` usa Highcharts desde CDN y carga los datos con `fetch` desde URLs JSON de Flask:

- `/api/estadisticas/miembros-por-dia`
- `/api/estadisticas/actividades-por-tipo`
- `/api/estadisticas/actividades-por-comuna`

Los comentarios de cada actividad tambien usan `fetch`:

- `GET /api/actividades/<id>/comentarios` lista comentarios.
- `POST /api/actividades/<id>/comentarios` valida e inserta un comentario.

## Decisiones

- Se reutilizo la estructura simple de las auxiliares con `database/db.py`, `SessionLocal` y modelos SQLAlchemy.
- El formulario de registro une miembro, actividades y fotos porque el enunciado pide registrar miembro y actividades en un mismo flujo.
- Los graficos se generan en el cliente, siguiendo el ejemplo de la auxiliar con Highcharts y `fetch`.
- Los comentarios se validan en JavaScript y tambien en Flask antes de insertar en la base de datos.
