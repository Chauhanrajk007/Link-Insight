const form = document.getElementById("inspectForm");
const btn = document.getElementById("inspectBtn");
const overlay = document.getElementById("overlay");
const result = document.getElementById("result");
const closeBtn = document.getElementById("closePopup");

// Safety
overlay.classList.add("hidden");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("urlInput").value.trim();
  if (!url.startsWith("http")) {
    alert("Enter full URL including https://");
    return;
  }

  btn.textContent = "Inspecting…";
  btn.classList.add("loading");
  btn.disabled = true;

  try {
    const res = await fetch(`/api/inspect?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    result.innerHTML = `
      <h2>What this link does</h2>

      ${data.insights.map(x => `<div class="insight">✔ ${x}</div>`).join("")}
      ${data.warnings.map(x => `<div class="warning">⚠ ${x}</div>`).join("")}

      <p style="margin-top:16px;font-size:13px;color:#64748b">
        This preview is generated without clicking the link.
      </p>
    `;

    overlay.classList.remove("hidden");
    document.body.classList.add("modal-open");

  } catch {
    alert("Unable to inspect link");
  }

  btn.textContent = "Inspect";
  btn.classList.remove("loading");
  btn.disabled = false;
});

closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
  document.body.classList.remove("modal-open");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }
});
