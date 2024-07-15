import { useState } from "react";
import "./App.css";
import backgroundVideo from "./assets/vid.mp4";

const App = () => {
  const [text, setText] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const callApi = async () => {
    setError("");
    setShortUrl("");
    try {
      const res = await fetch(
        `https://url-shortner-azki.onrender.com/shorten`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: text }), // Include the URL in the request body
        }
      );
      if (!res.ok) {
        throw new Error("Invalid URL");
      }
      const data = await res.json();
      setShortUrl(data.message);
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid URL");
      return null;
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      alert("Copied to clipboard!");
    });
  };
  return (
    <>
      <div className="container">
        <div className="vidContainer">
          <video
            className="video"
            src={backgroundVideo}
            muted
            loop
            autoPlay
          ></video>
        </div>
        <div className="mainContainer">
          <div className="app">
            <div className="heading">
              <h1>URL Shortener</h1>
            </div>
            <div className="shortener">
              <input
                type="text"
                placeholder="Enter URL"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={callApi}>Shorten</button>
            </div>
            <div className="output">
              {error && <p className="error">{error}</p>}
              {shortUrl && (
                <div>
                  <p>{{shortUrl}}</p>
                  <button onClick={handleCopy}>Copy</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

// https://url-shortner-azki.onrender.com
