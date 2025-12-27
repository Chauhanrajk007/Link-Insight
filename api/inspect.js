export default function handler(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  const u = url.toLowerCase();
  let insights = [];
  let warnings = [];

  // HTTPS
  if (u.startsWith("https://")) {
    insights.push("Uses HTTPS encryption");
  } else {
    warnings.push("Does not use HTTPS");
  }

  // File actions
  if (u.endsWith(".pdf")) {
    insights.push("Opens a PDF document");
  }

  if (u.endsWith(".zip") || u.endsWith(".exe") || u.endsWith(".apk")) {
    insights.push("Triggers a file download");
    warnings.push("Downloads are often used to deliver malware");
  }

  // Login / account intent
  if (
    u.includes("login") ||
    u.includes("signin") ||
    u.includes("verify") ||
    u.includes("account")
  ) {
    insights.push("Likely leads to a login or account page");
    warnings.push("Login pages are common phishing targets");
  }

  // Gambling / money
  if (
    u.includes("bet") ||
    u.includes("casino") ||
    u.includes("bonus") ||
    u.includes("reward")
  ) {
    insights.push("Related to betting or financial activity");
    warnings.push("Financial links carry higher risk if untrusted");
  }

  // URL shorteners
  if (
    u.includes("bit.ly") ||
    u.includes("tinyurl") ||
    u.includes("t.co")
  ) {
    insights.push("Uses a URL shortener");
    warnings.push("Shortened links hide the final destination");
  }

  if (insights.length === 0) {
    insights.push("Appears to be a normal informational website");
  }

  return res.json({
    insights,
    warnings
  });
}
