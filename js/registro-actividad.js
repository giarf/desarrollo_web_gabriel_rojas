const activityForm = document.getElementById("activity-form");
const activityBox = document.getElementById("activity-box");
const activityErrors = document.getElementById("activity-errors");
const activityOk = document.getElementById("activity-ok");

const marcarActividad = (input, malo) => input.classList.toggle("error", malo);

activityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const miembro = document.getElementById("miembro");
  const actividad = document.getElementById("actividad");
  const categoria = document.getElementById("categoria");
  const dia = document.getElementById("dia");
  const inicio = document.getElementById("inicio");
  const termino = document.getElementById("termino");
  const archivo = document.getElementById("archivo");
  const enlace = document.getElementById("enlace");
  const errores = [];

  [miembro, actividad, categoria, dia, inicio, termino, archivo, enlace].forEach((i) => i.classList.remove("error"));

  if (miembro.value === "") {
    errores.push("Debe seleccionar un miembro");
    marcarActividad(miembro, true);
  }
  if (actividad.value.trim().length < 3) {
    errores.push("Nombre de actividad inválido");
    marcarActividad(actividad, true);
  }
  if (categoria.value === "") {
    errores.push("Debe seleccionar tipo de actividad");
    marcarActividad(categoria, true);
  }
  if (dia.value === "") {
    errores.push("Debe seleccionar un día");
    marcarActividad(dia, true);
  }
  if (inicio.value === "" || termino.value === "" || inicio.value >= termino.value) {
    errores.push("Horario inválido");
    marcarActividad(inicio, true);
    marcarActividad(termino, true);
  }
  if (archivo.files.length < 1) {
    errores.push("Debe agregar un archivo");
    marcarActividad(archivo, true);
  } else if (!archivo.files[0].type.startsWith("image/") && !archivo.files[0].type.startsWith("video/")) {
    errores.push("El archivo debe ser foto o video");
    marcarActividad(archivo, true);
  }
  if (!/^https?:\/\/.+/.test(enlace.value)) {
    errores.push("Enlace inválido");
    marcarActividad(enlace, true);
  }

  activityBox.hidden = false;
  activityErrors.textContent = "";
  activityOk.textContent = "";

  if (errores.length > 0) {
    errores.forEach((error) => {
      const li = document.createElement("li");
      li.textContent = error;
      activityErrors.appendChild(li);
    });
    return;
  }

  activityOk.textContent = "Formulario válido.";
});
