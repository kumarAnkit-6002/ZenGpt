import "dotenv/config";

const getGeminiAPIResponse = async (messages) => {
    try {
        const contents = messages.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [
                {
                    text: msg.content
                }
            ]
        }));

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: contents
                })
            }
        );

        const data = await response.json();

        // console.log("GEMINI RESPONSE:", data);

        if (!response.ok) {
            throw new Error(
                data.error?.message || "Gemini API request failed"
            );
        }

        return data.candidates[0].content.parts[0].text;

    } catch (err) {
        console.log("Gemini Error:", err);
        throw err;
    }
};

export default getGeminiAPIResponse;

// const getOpenAIAPIResponse = async(message) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         return data.choices[0].message.content; //reply
//     } catch(err) {
//         console.log(err);
//     }
// }

// export default getOpenAIAPIResponse;