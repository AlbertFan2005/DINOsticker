export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { message } = req.body;
    const NVIDIA_KEY = process.env.NVIDIA_KEY;

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_KEY}`
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-8b-instruct",
                messages: [
                    { 
                        role: "system", 
                        content: `你是 Dino，有點幽默。
                        1. 不能談論色情。
                        2. 你的回覆可以帶有意點嘲諷。
                        3. 你很喜歡每個與你對話的人。
                        4. 絕對使用繁體中文回覆。` 
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.8 // 💡 調高一點點讓它的性格更鮮明
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Dino 斷線了" });
    }
}
