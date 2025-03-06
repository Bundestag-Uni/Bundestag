// pages/api/summarize.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "No text provided" });
        }

        const HF_API_KEY = process.env.HF_API_KEY;
        const HF_API_URL = "https://api-inference.huggingface.co/models/mrm8488/bert2bert_shared-german-finetuned-summarization";

        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: text,
                parameters: {
                    max_length: 500,
                    min_length: 100
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            return res.status(response.status).json({ error: err });
        }

        const data = await response.json();
        console.log("Hugging Face raw data:", data);


        const summary = data?.[0]?.summary_text || "Keine Zusammenfassung gefunden.";

        return res.status(200).json({ summary });
    } catch (error) {
        console.error("Fehler bei der Zusammenfassung:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
