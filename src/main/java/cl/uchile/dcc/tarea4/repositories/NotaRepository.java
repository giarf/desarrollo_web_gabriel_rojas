package cl.uchile.dcc.tarea4.repositories;

import cl.uchile.dcc.tarea4.models.Nota;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends CrudRepository<Nota, Integer> {
    @Query(value = "SELECT AVG(nota) FROM nota WHERE actividad_id = :actividadId", nativeQuery = true)
    Double promedioPorActividad(@Param("actividadId") Integer actividadId);
}
