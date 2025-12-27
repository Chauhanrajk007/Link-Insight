const form = document.getElementById("inspectForm");
const btn = document.getElementById("inspectBtn");

const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const result = document.getElementById("result");
const closeBtn = document.getElementById("closePopup");

// NEVER show popup on load
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
      <h2>Link insight</h2>

      ${data.insights.map(i => `<div>🔍 ${i}</div>`).join("")}
      ${data.warnings.map(w => `<div>⚠ ${w}</div>`).join("")}

      <p style="font-size:12px;color:#666;margin-top:10px">
        Explains what happens if you click the link.
      </p>
    `;

    // ✅ OPEN POPUP
    overlay.classList.remove("hidden");

  } catch {
    alert("Error inspecting link");
  }

  btn.textContent = "Inspect";
  btn.disabled = false;
});

// Close popup
closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// Close when clicking outside
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});
