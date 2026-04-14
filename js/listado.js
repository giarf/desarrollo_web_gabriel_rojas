const filtro = document.getElementById("filtro");
const orden = document.getElementById("orden");
const tabla = document.getElementById("tabla-miembros");
const paginaTexto = document.getElementById("pagina-texto");
const anterior = document.getElementById("anterior");
const siguiente = document.getElementById("siguiente");

let pagina = 1;
const porPagina = 3;

const render = () => {
  let datos = [...miembros];

  if (filtro.value !== "") {
    datos = datos.filter((m) => m.tipo === filtro.value);
  }

  datos.sort((a, b) => a[orden.value].localeCompare(b[orden.value], "es"));

  const total = Math.max(1, Math.ceil(datos.length / porPagina));
  if (pagina > total) {
    pagina = total;
  }

  const inicio = (pagina - 1) * porPagina;
  const paginaDatos = datos.slice(inicio, inicio + porPagina);

  tabla.textContent = "";
  if (paginaDatos.length === 0) {
    tabla.innerHTML = "<tr><td colspan='4'>Sin resultados</td></tr>";
  }
  paginaDatos.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = "<td>" + m.nombre + "</td><td>" + m.tipo + "</td><td>" + m.correo + "</td><td>" + m.telefono + "</td>";
    tabla.appendChild(tr);
  });

  paginaTexto.textContent = "Página " + pagina + " de " + total;
  anterior.disabled = pagina === 1;
  siguiente.disabled = pagina === total;
};

filtro.addEventListener("change", () => {
  pagina = 1;
  render();
});

orden.addEventListener("change", () => {
  pagina = 1;
  render();
});

anterior.addEventListener("click", () => {
  pagina -= 1;
  render();
});

siguiente.addEventListener("click", () => {
  pagina += 1;
  render();
});

render();
