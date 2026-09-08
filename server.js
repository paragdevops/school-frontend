require("dotenv").config();

const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.log("");
  console.log("⚠️  No .env file found. Using default values or runtime env vars.");
  console.log("   For local dev, create .env with PORT and BACKEND_URL.");
  console.log("");
}

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

app.get("/", (req, res) => {
  const htmlFilePath = path.join(__dirname, "public", "index.html");
  let htmlContent = fs.readFileSync(htmlFilePath, "utf8");
  htmlContent = htmlContent.replaceAll("__BACKEND_URL__", BACKEND_URL);
  res.send(htmlContent);
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("=============================================");
  console.log("  School Frontend Server");
  console.log("=============================================");
  console.log(`  Running at   : http://localhost:${PORT}`);
  console.log(`  Backend URL  : ${BACKEND_URL}`);
  console.log("=============================================");
  console.log("  Open the URL above in your browser.");
  console.log("=============================================");
});