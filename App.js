import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const [telegramToken, setTelegramToken] = useState("");
  const [openAiKey, setOpenAiKey] = useState("");
  const [googleData, setGoogleData] = useState(null);

  // Replace with your n8n webhook URL
  const WEBHOOK_URL = "https://n8n.jltech.az:8443/webhook-test/store-creds";

  // Google OAuth success
  const handleGoogleSuccess = (response) => {
    console.log("Google login success:", response);
    setGoogleData(response);
  };

  // Google OAuth failure
  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
  };

  // Submit all credentials to n8n webhook
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!googleData) {
      alert("Please connect your Google account first!");
      return;
    }

    const payload = {
      telegramToken,
      openAiKey,
      googleData,
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Credentials sent to n8n successfully!");
      } else {
        alert("Failed to send credentials to n8n.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending credentials to n8n.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Receipt Bot Onboarding</h2>

      <GoogleLogin
        clientId="67766210990-41avvp144hpd8hfgoqdj8tu990acagn5.apps.googleusercontent.com" // Replace with your Google Client ID
        buttonText="Connect Google Account"
        scope="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets"
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
        cookiePolicy={"single_host_origin"}
      />

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Telegram Bot Token"
          value={telegramToken}
          onChange={(e) => setTelegramToken(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <input
          type="text"
          placeholder="OpenAI API Key"
          value={openAiKey}
          onChange={(e) => setOpenAiKey(e.target.value)}
          required
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <button type="submit">Send Credentials to n8n</button>
      </form>
    </div>
  );
}

export default App;
