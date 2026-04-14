const memberForm = document.getElementById("member-form");
const tipo = document.getElementById("tipo");
const extraLabel = document.getElementById("extra-label");
const memberBox = document.getElementById("member-box");
const memberErrors = document.getElementById("member-errors");
const memberOk = document.getElementById("member-ok");

const extraTexto = {
  pregrado: "Carrera *",
  postgrado: "Programa *",
  funcionario: "Unidad *",
  academico: "Departamento *"
};

const marcar = (input, malo) => input.classList.toggle("error", malo);

tipo.addEventListener("change", () => {
  extraLabel.textContent = extraTexto[tipo.value] || "Dato específico *";
});

memberForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const telefono = document.getElementById("telefono");
  const extra = document.getElementById("dato-extra");
  const errores = [];

  [nombre, correo, telefono, tipo, extra].forEach((i) => i.classList.remove("error"));

  if (nombre.value.trim().length < 3) {
    errores.push("Nombre inválido");
    marcar(nombre, true);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value)) {
    errores.push("Correo inválido");
    marcar(correo, true);
  }
  if (!/^[0-9]{8,15}$/.test(telefono.value)) {
    errores.push("Teléfono inválido");
    marcar(telefono, true);
  }
  if (tipo.value === "") {
    errores.push("Debe seleccionar tipo de miembro");
    marcar(tipo, true);
  }
  if (extra.value.trim().length < 2) {
    errores.push("Dato específico inválido");
    marcar(extra, true);
  }

  memberBox.hidden = false;
  memberErrors.textContent = "";
  memberOk.textContent = "";

  if (errores.length > 0) {
    errores.forEach((error) => {
      const li = document.createElement("li");
      li.textContent = error;
      memberErrors.appendChild(li);
    });
    return;
  }

  memberOk.textContent = "Formulario válido.";
});
