package cl.uchile.dcc.tarea4.repositories;

import cl.uchile.dcc.tarea4.models.Actividad;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ActividadRepository extends CrudRepository<Actividad, Integer> {
    @Query(value = """
            SELECT a.id, m.nombre AS miembro, a.dia, a.tipo, c.nombre AS comuna,
                   a.nombre, COALESCE(a.descripcion, '') AS descripcion, AVG(n.nota) AS nota
            FROM actividad a
            JOIN miembro m ON m.id = a.miembro_id
            JOIN comuna c ON c.id = m.comuna_id
            LEFT JOIN nota n ON n.actividad_id = a.id
            WHERE LOWER(a.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(COALESCE(a.descripcion, '')) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
            GROUP BY a.id, m.nombre, a.dia, a.tipo, c.nombre, a.nombre, a.descripcion
            ORDER BY a.nombre ASC
            """, nativeQuery = true)
    List<Object[]> buscar(@Param("q") String q);
}
