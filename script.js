const form = document.getElementById("inspectForm");
const btn = document.getElementById("inspectBtn");

const overlay = document.getElementById("overlay");
const result = document.getElementById("result");
const closeBtn = document.getElementById("closePopup");

// Ensure popup is hidden on load
overlay.classList.add("hidden");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("urlInput").value.trim();

  if (!url.startsWith("http")) {
    alert("Please enter the full URL including https://");
    return;
  }

  btn.textContent = "Inspecting…";
  btn.disabled = true;

  try {
    const res = await fetch(`/api/inspect?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (data.error) {
      alert("Unable to inspect this link right now.");
      return;
    }

    result.innerHTML = `
      <h2>Link behavior analysis</h2>

      <div class="section">
        ${data.insights.map(i =>
          `<div class="insight">🔍 ${i}</div>`
        ).join("")}
      </div>

      ${
        data.warnings.length
          ? `<div class="section">
              ${data.warnings.map(w =>
                `<div class="warning">⚠ ${w}</div>`
              ).join("")}
            </div>`
          : ""
      }

      <div class="footnote">
        This analysis is based on link structure and common web behavior patterns.
        It does not guarantee safety.
      </div>
    `;

    overlay.classList.remove("hidden");

  } catch {
    alert("Error inspecting link. Please try again.");
  }

  btn.textContent = "Inspect";
  btn.disabled = false;
});

// Close popup
closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// Close when clicking outside popup
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});
