const express = require("express");
const fs = require("fs").promises;
const shortid = require("shortid");
const cors = require("cors");
const app = express();
const path = require("path");

const isUrlValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

app.use(express.json());
app.use(cors());

const urlsFilePath = path.join(__dirname, "urls.json");

app.post("/shorten", async (req, res) => {
  const longUrl = req.body.url;

  if (!isUrlValid(longUrl)) {
    return res.status(400).json({
      success: false,
      message: "Invalid URL",
    });
  }

  try {
    const urlsFromFile = await fs.readFile(urlsFilePath, { encoding: "utf-8" });
    const urlsJson = JSON.parse(urlsFromFile);

    const shortUrl = shortid.generate();
    urlsJson[shortUrl] = longUrl;

    await fs.writeFile(urlsFilePath, JSON.stringify(urlsJson, null, 2));
    
    res.json({
      success: true,
      message: `${shortUrl}`,
    });
  } catch (err) {
    console.error("Error reading or writing file", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  try {
    const longUrls = await fs.readFile(urlsFilePath, { encoding: "utf-8" });
    const urlsJson = JSON.parse(longUrls);
    const url = urlsJson[shortUrl];

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    res.redirect(url);
  } catch (err) {
    console.error("Error reading file", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

