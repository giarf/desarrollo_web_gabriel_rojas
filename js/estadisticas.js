const tablaMiembrosTipo = document.getElementById("tabla-miembros-tipo");
const tablaActividadesTipo = document.getElementById("tabla-actividades-tipo");

const contar = (lista, clave) => {
  const conteo = {};
  lista.forEach((item) => {
    conteo[item[clave]] = (conteo[item[clave]] || 0) + 1;
  });
  return conteo;
};

const dibujar = (contenedor, datos) => {
  Object.keys(datos).forEach((key) => {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td>" + key + "</td><td>" + datos[key] + "</td>";
    contenedor.appendChild(tr);
  });
};

dibujar(tablaMiembrosTipo, contar(miembros, "tipo"));
dibujar(tablaActividadesTipo, contar(actividades, "tipo"));
