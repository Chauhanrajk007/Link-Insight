const form = document.getElementById("inspectForm");
const btn = document.getElementById("inspectBtn");

const overlay = document.getElementById("overlay");
const result = document.getElementById("result");
const closeBtn = document.getElementById("closePopup");

overlay.classList.add("hidden");

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
      <h2>What this link is likely to do</h2>

      ${data.insights.map(i => `<p>🔍 ${i}</p>`).join("")}
      ${data.warnings.map(w => `<p>⚠ ${w}</p>`).join("")}

      <p style="font-size:12px;color:#666;margin-top:12px">
        This tool explains link intent, not overall website trust.
      </p>
    `;

    overlay.classList.remove("hidden");

  } catch {
    alert("Error inspecting link");
  }

  btn.textContent = "Inspect";
  btn.disabled = false;
});

closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});
