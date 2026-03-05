export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { message } = req.body;
    const NVIDIA_KEY = process.env.NVIDIA_KEY; // 💡 密鑰會鎖在雲端，前端看不到

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_KEY}`
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-8b-instruct",
                messages: [{ role: "user", content: message }]
            })
        });
        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ error: "Dino 斷線了" });
    }
}
