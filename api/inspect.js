export default function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.json({ error: "URL required" });

  const u = url.toLowerCase();
  let insights = [];
  let warnings = [];

  // intent signals
  if (u.includes("login") || u.includes("signin") || u.includes("verify")) {
    insights.push("Leads to a login or account verification page");
    warnings.push("Login pages are common phishing targets");
  }

  if (u.includes("free") || u.includes("reward") || u.includes("bonus")) {
    insights.push("Uses reward or promotional language");
    warnings.push("Reward-based links are often used in scams");
  }

  if (u.includes("bet") || u.includes("casino") || u.includes("stake")) {
    insights.push("Related to betting or gambling activity");
    warnings.push("Gambling links carry financial risk");
  }

  if (u.includes("bit.ly") || u.includes("tinyurl") || u.includes("t.co")) {
    insights.push("Uses a URL shortener");
    warnings.push("Shortened links hide the final destination");
  }

  if (u.endsWith(".pdf")) {
    insights.push("Opens a PDF document");
  }

  if (insights.length === 0) {
    insights.push("Appears to be a normal informational webpage");
  }

  return res.json({ insights, warnings });
}
