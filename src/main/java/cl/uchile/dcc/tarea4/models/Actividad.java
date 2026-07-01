package cl.uchile.dcc.tarea4.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "actividad")
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "miembro_id")
    private Integer miembroId;

    private String dia;
    private String tipo;
    private String nombre;
    private String descripcion;

    public Integer getId() {
        return id;
    }
}
