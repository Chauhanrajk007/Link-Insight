export default async function handler(req, res) {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: "URL required" });
    }

    let insights = [];
    let warnings = [];

    // HEAD request (lightweight)
    const headRes = await fetch(url, { method: "HEAD", redirect: "manual" });

    // Redirect detection
    if (headRes.status >= 300 && headRes.status < 400) {
      warnings.push("This link redirects to another page");
    }

    // Content type
    const contentType = headRes.headers.get("content-type") || "";

    if (contentType.includes("application/pdf")) {
      insights.push("Opens a PDF document");
    } else if (contentType.includes("application/zip")) {
      warnings.push("Triggers a file download");
    } else if (contentType.includes("text/html")) {
      insights.push("Opens a normal web page");
    }

    // Fetch small HTML sample (safe)
    let html = "";
    if (contentType.includes("text/html")) {
      const pageRes = await fetch(url);
      html = (await pageRes.text()).slice(0, 5000);
    }

    // Detect forms
    if (html.includes("<form")) {
      warnings.push("Contains a form (may collect user input)");
    }

    if (html.includes("type=\"password\"")) {
      warnings.push("Contains a password field (login page)");
    }

    // HTTPS
    if (url.startsWith("https://")) {
      insights.push("Uses secure HTTPS connection");
    } else {
      warnings.push("Does not use HTTPS");
    }

    // Fallback
    if (insights.length === 0 && warnings.length === 0) {
      insights.push("No unusual behavior detected");
    }

    res.status(200).json({
      insights,
      warnings
    });

  } catch (err) {
    res.status(500).json({ error: "Unable to inspect link" });
  }
}
