const input = document.getElementById("search-input");
const statusText = document.getElementById("status");
const results = document.getElementById("results");

let lastQuery = "";

function escapeHtml(text) {
    return String(text ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text, query) {
    const safeText = escapeHtml(text || "-");
    if (!query) {
        return safeText;
    }
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    return safeText.replace(regex, "<mark>$1</mark>");
}

function formatGrade(grade) {
    if (grade === null || grade === undefined) {
        return "-";
    }
    return Number(grade).toFixed(1);
}

function renderResults(data, query) {
    results.innerHTML = "";
    if (data.length === 0) {
        statusText.textContent = "No se encontraron actividades.";
        return;
    }

    statusText.textContent = `${data.length} resultado(s) encontrado(s).`;
    for (const activity of data) {
        const article = document.createElement("article");
        article.className = "activity-card";
        article.dataset.activityId = activity.id;
        article.innerHTML = `
            <h2>${highlight(activity.nombre, query)}</h2>
            <div class="activity-meta">
                <span><strong>Miembro:</strong> ${escapeHtml(activity.miembro)}</span>
                <span><strong>Dia:</strong> ${escapeHtml(activity.dia)}</span>
                <span><strong>Tipo:</strong> ${escapeHtml(activity.tipo)}</span>
                <span><strong>Comuna:</strong> ${highlight(activity.comuna, query)}</span>
            </div>
            <p class="description"><strong>Descripcion:</strong> ${highlight(activity.descripcion, query)}</p>
            <div class="grade-row">
                <span><strong>Nota:</strong> <span class="grade-value">${formatGrade(activity.nota)}</span></span>
                <button class="evaluate-button" type="button">Evaluar</button>
            </div>
        `;
        results.appendChild(article);
    }
}

async function search() {
    const query = input.value.trim();
    lastQuery = query;
    results.innerHTML = "";

    if (query.length < 3) {
        statusText.textContent = "Ingresa 3 caracteres para comenzar.";
        return;
    }

    statusText.textContent = "Buscando...";
    const response = await fetch(`/api/actividades/buscar?q=${encodeURIComponent(query)}`);
    const payload = await response.json();
    if (query !== lastQuery) {
        return;
    }
    renderResults(payload.data, query);
}

async function evaluateActivity(card) {
    const activityId = card.dataset.activityId;
    const value = window.prompt("Ingrese una nota entera entre 1 y 7");
    if (value === null) {
        return;
    }

    const grade = Number(value);
    if (!Number.isInteger(grade) || grade < 1 || grade > 7) {
        window.alert("La nota debe ser un entero entre 1 y 7.");
        return;
    }

    const response = await fetch(`/api/actividades/${activityId}/notas`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ nota: grade })
    });
    const payload = await response.json();

    if (payload.error) {
        window.alert(payload.error || "No se pudo guardar la nota.");
        return;
    }

    card.querySelector(".grade-value").textContent = formatGrade(payload.nota);
}

input.addEventListener("input", search);
results.addEventListener("click", (event) => {
    if (event.target.classList.contains("evaluate-button")) {
        evaluateActivity(event.target.closest(".activity-card"));
    }
});
