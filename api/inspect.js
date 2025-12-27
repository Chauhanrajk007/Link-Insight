export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  let insights = [];
  let warnings = [];
  const lowerUrl = url.toLowerCase();

  // ---------- HTTPS ----------
  if (lowerUrl.startsWith("https://")) {
    insights.push("Uses a secure HTTPS connection");
  } else {
    warnings.push("Does not use HTTPS");
  }

  // ---------- FILE TYPE ----------
  if (lowerUrl.endsWith(".pdf")) {
    insights.push("Opens a PDF document");
  }

  if (
    lowerUrl.endsWith(".zip") ||
    lowerUrl.endsWith(".exe") ||
    lowerUrl.endsWith(".apk")
  ) {
    warnings.push("Triggers a file download");
  }

  // ---------- SHORTENER ----------
  const shorteners = ["bit.ly", "tinyurl", "t.co", "goo.gl"];
  if (shorteners.some(s => lowerUrl.includes(s))) {
    warnings.push(
      "Uses a link shortener, which hides the final destination and is commonly abused in scams"
    );
  }

  // ---------- REDIRECT CHECK ----------
  try {
    const head = await fetch(url, { method: "HEAD", redirect: "manual" });
    if (head.status >= 300 && head.status < 400) {
      warnings.push(
        "Redirects to another website, a technique often used in phishing and scam links"
      );
    }
  } catch {
    warnings.push(
      "The destination blocks inspection, which is common for suspicious or protected links"
    );
  }

  // ---------- SCAM LANGUAGE ----------
  const scamWords = [
    "login", "verify", "reward",
    "bonus", "free", "claim", "account"
  ];

  if (scamWords.some(w => lowerUrl.includes(w))) {
    warnings.push(
      "Link contains language commonly used in phishing or scam messages"
    );
  }

  if (insights.length === 0 && warnings.length === 0) {
    insights.push("No obvious risky behavior detected");
  }

  return res.status(200).json({
    insights,
    warnings
  });
}
