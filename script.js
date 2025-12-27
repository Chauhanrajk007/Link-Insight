const form = document.getElementById("inspectForm");
const btn = document.getElementById("inspectBtn");

const overlay = document.getElementById("overlay");
const result = document.getElementById("result");
const closeBtn = document.getElementById("closePopup");

// Hide popup on load
overlay.classList.add("hidden");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("urlInput").value.trim();
  if (!url.startsWith("http")) {
    alert("Enter the full URL (https://...)");
    return;
  }

  btn.textContent = "Checking…";
  btn.disabled = true;

  try {
    const res = await fetch(`/api/inspect?url=${encodeURIComponent(url)}`);
    const data = await res.json();

    if (data.error) {
      alert("Could not analyze this link");
      return;
    }

    // ---- RENDER MINIMAL RESULT ----
    result.innerHTML = `
      <h2>Link check result</h2>

      <div class="block">
        <strong>What happens if you click:</strong>
        <ul>
          ${data.insights.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>

      ${
        data.warnings.length
          ? `<div class="block warn">
              <strong>Things to be careful about:</strong>
              <ul>
                ${data.warnings.map(w => `<li>${w}</li>`).join("")}
              </ul>
            </div>`
          : `<div class="block ok">
              No common risk patterns were detected in this link.
            </div>`
      }
    `;

    overlay.classList.remove("hidden");

  } catch {
    alert("Something went wrong");
  }

  btn.textContent = "Check";
  btn.disabled = false;
});

// Close popup
closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// Click outside closes popup
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.add("hidden");
});
