app.post("/api/gemini", async (req, res) => {
  console.log("✅ Request hit");

  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", data);

    res.json(data);

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Backend error" });
  }
});