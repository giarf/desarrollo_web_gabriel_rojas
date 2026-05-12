const form = document.getElementById("register-form");
const addActivityButton = document.getElementById("add-activity");
const activitiesContainer = document.getElementById("activities");
const clientErrors = document.getElementById("client-errors");
const clientErrorsList = clientErrors.querySelector("ul");

let activityCount = 1;

const mark = (input, invalid) => input.classList.toggle("error", invalid);

const activityTemplate = (index) => `
  <fieldset class="activity-block">
    <legend>Actividad ${index + 1}</legend>

    <label>Nombre de la actividad *</label>
    <input name="actividad_nombre[]" type="text">

    <label>Día *</label>
    <select name="dia[]">
      <option value="">Seleccione</option>
      <option value="lunes">Lunes</option>
      <option value="martes">Martes</option>
      <option value="miércoles">Miércoles</option>
      <option value="jueves">Jueves</option>
      <option value="viernes">Viernes</option>
      <option value="sábado">Sábado</option>
      <option value="domingo">Domingo</option>
    </select>

    <label>Hora inicio *</label>
    <input name="hora_inicio[]" type="time">

    <label>Duración *</label>
    <input name="duracion[]" type="text" placeholder="HH:MM">

    <label>Tipo *</label>
    <select name="tipo[]">
      <option value="">Seleccione</option>
      <option value="arte">Arte</option>
      <option value="deporte">Deporte</option>
      <option value="tecnología">Tecnología</option>
      <option value="social">Social</option>
      <option value="recreación">Recreación</option>
      <option value="otra">Otra</option>
    </select>

    <label>Descripción</label>
    <textarea name="descripcion[]" rows="4"></textarea>

    <label>Fotos *</label>
    <input name="foto_${index}[]" type="file" accept="image/*" multiple>
  </fieldset>`;

addActivityButton.addEventListener("click", () => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = activityTemplate(activityCount);
  activitiesContainer.appendChild(wrapper.firstElementChild);
  activityCount += 1;
});

form.addEventListener("submit", (event) => {
  const errors = [];
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const telefono = document.getElementById("telefono");
  const comuna = document.getElementById("comuna_id");

  form.querySelectorAll(".error").forEach((input) => input.classList.remove("error"));

  if (nombre.value.trim().length < 3) {
    errors.push("Nombre inválido");
    mark(nombre, true);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.push("Correo inválido");
    mark(email, true);
  }
  if (!/^[0-9]{8,15}$/.test(telefono.value)) {
    errors.push("Teléfono inválido");
    mark(telefono, true);
  }
  if (comuna.value === "") {
    errors.push("Debe seleccionar una comuna");
    mark(comuna, true);
  }

  document.querySelectorAll(".activity-block").forEach((block, index) => {
    const name = block.querySelector("input[name='actividad_nombre[]']");
    const day = block.querySelector("select[name='dia[]']");
    const start = block.querySelector("input[name='hora_inicio[]']");
    const duration = block.querySelector("input[name='duracion[]']");
    const type = block.querySelector("select[name='tipo[]']");
    const photo = block.querySelector("input[type='file']");
    const label = `Actividad ${index + 1}`;

    if (name.value.trim().length < 3) {
      errors.push(`${label}: nombre inválido`);
      mark(name, true);
    }
    if (day.value === "") {
      errors.push(`${label}: debe seleccionar día`);
      mark(day, true);
    }
    if (start.value === "") {
      errors.push(`${label}: hora de inicio inválida`);
      mark(start, true);
    }
    if (!/^[0-9]{1,2}:[0-5][0-9]$/.test(duration.value)) {
      errors.push(`${label}: duración inválida`);
      mark(duration, true);
    }
    if (type.value === "") {
      errors.push(`${label}: debe seleccionar tipo`);
      mark(type, true);
    }
    if (photo.files.length < 1) {
      errors.push(`${label}: debe agregar al menos una foto`);
      mark(photo, true);
    }
  });

  clientErrors.hidden = errors.length === 0;
  clientErrorsList.textContent = "";
  errors.forEach((error) => {
    const li = document.createElement("li");
    li.textContent = error;
    clientErrorsList.appendChild(li);
  });

  if (errors.length > 0) {
    event.preventDefault();
  }
});
