app.post("/api/gemini", async (req, res) => {
  try {
    console.log("Request received:", req.body);  // DEBUG

    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", data); // DEBUG

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    return res.json({ text });   // ✅ ALWAYS RETURN

  } catch (err) {
    console.error("ERROR:", err);

    return res.json({
      text: "Backend error occurred"
    });
  }
});