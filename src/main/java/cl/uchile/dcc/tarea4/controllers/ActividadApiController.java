package cl.uchile.dcc.tarea4.controllers;

import cl.uchile.dcc.tarea4.models.Nota;
import cl.uchile.dcc.tarea4.repositories.ActividadRepository;
import cl.uchile.dcc.tarea4.repositories.NotaRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ActividadApiController {
    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private NotaRepository notaRepository;

    @GetMapping("/api/actividades/buscar")
    public Map<String, Object> buscar(@RequestParam(name = "q", defaultValue = "") String q) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> data = new ArrayList<>();
        String texto = q.trim();

        if (texto.length() >= 3) {
            List<Object[]> rows = actividadRepository.buscar(texto);
            for (Object[] row : rows) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", row[0]);
                item.put("miembro", row[1]);
                item.put("dia", row[2]);
                item.put("tipo", row[3]);
                item.put("comuna", row[4]);
                item.put("nombre", row[5]);
                item.put("descripcion", row[6]);
                item.put("nota", row[7]);
                data.add(item);
            }
        }

        response.put("data", data);
        return response;
    }

    @PostMapping("/api/actividades/{id}/notas")
    public Map<String, Object> agregarNota(@PathVariable Integer id, @RequestParam String nota) {
        Map<String, Object> response = new HashMap<>();
        Integer valorNota;

        if (!actividadRepository.findById(id).isPresent()) {
            response.put("error", "La actividad no existe.");
            return response;
        }

        try {
            valorNota = Integer.parseInt(nota);
        } catch (NumberFormatException error) {
            response.put("error", "La nota debe ser un entero entre 1 y 7.");
            return response;
        }

        if (valorNota < 1 || valorNota > 7) {
            response.put("error", "La nota debe ser un entero entre 1 y 7.");
            return response;
        }

        Nota nuevaNota = new Nota();
        nuevaNota.setActividadId(id);
        nuevaNota.setNota(valorNota);
        notaRepository.save(nuevaNota);

        response.put("actividadId", id);
        response.put("nota", notaRepository.promedioPorActividad(id));
        return response;
    }
}
