# Tarea 4 - CC5002

Aplicacion Spring Boot para buscar actividades extraprogramaticas y evaluarlas con notas entre 1 y 7.

## Requisitos

- Java 17 o superior.
- MySQL corriendo localmente o con Docker Compose.
- Base de datos `tarea2`, la misma usada por las tareas anteriores.
- Usuario MySQL `cc5002` con password `programacionweb`.

La configuracion esta en `src/main/resources/application.properties`. La aplicacion se conecta a MySQL en `localhost:3306/tarea2`.

## Base de datos

Ejecutar los SQL en este orden:

1. `tarea2.sql`: crea el esquema `tarea2` y las tablas originales.
2. `region-comuna.sql`: carga regiones y comunas.
3. `tabla-comentario.sql`: mantiene compatibilidad con la tabla de comentarios de la tarea anterior.
4. `tabla-nota.sql`: crea la tabla `nota` usada en esta tarea.

La tabla `nota` guarda cada evaluacion en una fila independiente. La nota mostrada en pantalla corresponde al promedio de las notas de la actividad; si una actividad no tiene notas, se muestra `-`.

## Ejecucion

La base puede levantarse desde la carpeta `../tarea2`:

```bash
cd ../tarea2
docker compose up -d
```

Para agregar la tabla nueva de esta tarea en el contenedor de Tarea 2:

```bash
cd ../tarea4
docker exec -i tarea2-appweb2-1 mysql -u root -proot tarea2 < tabla-nota.sql
```

Si necesitas crear la base desde cero con MySQL instalado directamente:

```bash
mysql -u cc5002 -p < tarea2.sql
mysql -u cc5002 -p tarea2 < region-comuna.sql
mysql -u cc5002 -p tarea2 < tabla-comentario.sql
mysql -u cc5002 -p tarea2 < tabla-nota.sql
```

Luego iniciar la aplicacion:

```bash
./mvnw spring-boot:run
```

Si no existe `mvnw`, usar Maven instalado:

```bash
mvn spring-boot:run
```

Luego abrir:

```text
http://localhost:8080/buscar
```

## Funcionalidades implementadas

- Busqueda asincrona con `fetch` desde 3 caracteres.
- Busca por nombre de actividad, descripcion o nombre de comuna.
- Muestra miembro, dia, tipo, comuna, nombre, descripcion y nota.
- Resalta el texto que calza con la busqueda.
- Muestra mensaje cuando no hay resultados.
- Permite evaluar una actividad con una nota entera entre 1 y 7.
- Valida la nota en frontend y backend.
- Guarda la nota con JPA en la tabla `nota`.
- Recalcula y actualiza la nota promedio en la interfaz sin recargar la pagina.

## Endpoints

- `GET /api/actividades/buscar?q=texto`: retorna las actividades que calzan con la busqueda.
- `POST /api/actividades/{id}/notas`: recibe el parametro de formulario `nota=7`, guarda la nota y retorna el nuevo promedio.

## Decisiones

- Se implemento solo lo pedido para Tarea 4, sin portar pantallas anteriores que no son requeridas por el enunciado.
- `spring.jpa.hibernate.ddl-auto=none` porque las tablas se crean desde los SQL entregados.
- Se usa la misma base `tarea2` de las tareas previas y se agrega solamente la tabla `nota`.
