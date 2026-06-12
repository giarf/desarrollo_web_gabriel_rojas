Highcharts.chart("miembros-dia-chart", {
  chart: { type: "line" },
  title: { text: "Miembros registrados por día" },
  xAxis: {
    type: "datetime",
    title: { text: "Día" },
  },
  yAxis: { title: { text: "Cantidad de miembros" }, allowDecimals: false },
  series: [{ name: "Miembros", data: [], color: "#2f7ed8" }],
});

Highcharts.chart("actividades-tipo-chart", {
  chart: { type: "pie" },
  title: { text: "Actividades por tipo" },
  series: [{ name: "Actividades", data: [] }],
});

Highcharts.chart("actividades-comuna-chart", {
  chart: { type: "column" },
  title: { text: "Actividades por comuna" },
  xAxis: { categories: [], title: { text: "Comuna" } },
  yAxis: { title: { text: "Cantidad de actividades" }, allowDecimals: false },
  series: [{ name: "Actividades", data: [], color: "#8bbc21" }],
});

const getChart = (id) => Highcharts.charts.find((chart) => chart && chart.renderTo.id === id);

fetch("/api/estadisticas/miembros-por-dia")
  .then((response) => response.json())
  .then((data) => {
    const parsedData = data.map((item) => {
      const [year, month, day] = item.date.split("-").map((part) => parseInt(part, 10));
      return [Date.UTC(year, month - 1, day), item.count];
    });
    getChart("miembros-dia-chart").update({ series: [{ data: parsedData }] });
  })
  .catch((error) => console.error("Error:", error));

fetch("/api/estadisticas/actividades-por-tipo")
  .then((response) => response.json())
  .then((data) => {
    const parsedData = data.map((item) => ({ name: item.type, y: item.count }));
    getChart("actividades-tipo-chart").update({ series: [{ data: parsedData }] });
  })
  .catch((error) => console.error("Error:", error));

fetch("/api/estadisticas/actividades-por-comuna")
  .then((response) => response.json())
  .then((data) => {
    const categories = data.map((item) => item.comuna);
    const values = data.map((item) => item.count);
    getChart("actividades-comuna-chart").update({ xAxis: { categories }, series: [{ data: values }] });
  })
  .catch((error) => console.error("Error:", error));
