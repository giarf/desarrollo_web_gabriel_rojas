package cl.uchile.dcc.tarea4.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AppController {
    @GetMapping({"/", "/buscar"})
    public String buscar() {
        return "buscar";
    }
}
