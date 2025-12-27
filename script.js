const form = document.getElementById("inspectForm");
const btn = document.getElementById("inspectBtn");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("urlInput").value.trim();
  if (!url.startsWith("http")) {
    alert("Enter full URL including https://");
    return;
  }

  btn.textContent = "Inspecting...";
  btn.disabled = true;

  try {
    const res = await fetch(`/api/inspect?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (data.error) {
      alert("Unable to inspect link");
      return;
    }

    result.innerHTML = `
      <h2>Link insight</h2>

      ${data.insights.map(i => `<div>🔍 ${i}</div>`).join("")}
      ${data.warnings.map(w => `<div>⚠ ${w}</div>`).join("")}

      <p style="font-size:12px;color:#666;margin-top:10px">
        This tool explains link behavior, not website trust.
      </p>
    `;
  } catch {
    alert("Error inspecting link");
  }

  btn.textContent = "Inspect";
  btn.disabled = false;
});
