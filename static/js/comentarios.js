const renderMessage = (container, messages, isError) => {
  container.textContent = messages.join(" ");
  container.classList.toggle("error-box", isError);
  container.classList.toggle("ok-box", !isError && messages.length > 0);
};

const renderComments = (container, comments) => {
  container.innerHTML = "";

  if (comments.length === 0) {
    container.textContent = "Esta actividad no tiene comentarios.";
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  ["Fecha", "Nombre", "Comentario"].forEach((text) => {
    const th = document.createElement("th");
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  comments.forEach((comment) => {
    const row = document.createElement("tr");
    [comment.fecha, comment.nombre, comment.texto].forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
};

const loadComments = (activityId, listContainer, messageContainer) => {
  fetch(`/api/actividades/${activityId}/comentarios`)
    .then((response) => response.json())
    .then((result) => {
      if (result.status !== "ok") {
        renderMessage(messageContainer, result.errors || ["No se pudieron cargar los comentarios."], true);
        return;
      }
      renderComments(listContainer, result.data);
    })
    .catch(() => renderMessage(messageContainer, ["No se pudieron cargar los comentarios."], true));
};

document.querySelectorAll(".comment-section").forEach((section) => {
  const activityId = section.dataset.actividadId;
  const form = section.querySelector(".comment-form");
  const listContainer = section.querySelector(".comments-list");
  const messageContainer = section.querySelector(".comment-messages");

  loadComments(activityId, listContainer, messageContainer);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = form.elements.nombre.value.trim();
    const texto = form.elements.texto.value.trim();
    const errors = [];

    if (nombre.length < 3 || nombre.length > 80) {
      errors.push("El nombre debe tener entre 3 y 80 caracteres.");
    }
    if (texto.length < 5 || texto.length > 300) {
      errors.push("El comentario debe tener entre 5 y 300 caracteres.");
    }

    if (errors.length > 0) {
      renderMessage(messageContainer, errors, true);
      return;
    }

    fetch(`/api/actividades/${activityId}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, texto }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status !== "ok") {
          renderMessage(messageContainer, result.errors || ["No se pudo guardar el comentario."], true);
          return;
        }
        form.reset();
        renderMessage(messageContainer, ["Comentario agregado correctamente."], false);
        loadComments(activityId, listContainer, messageContainer);
      })
      .catch(() => renderMessage(messageContainer, ["No se pudo guardar el comentario."], true));
  });
});
