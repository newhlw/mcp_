require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

const readline = require("readline");
let History = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion() {
  rl.question('Ask AI (type "exit" to quit): ', async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    History.push({
      role: "user",
      parts: [{ text: userInput }],
    });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: History,
      });

      console.log("AI:", response.candidates[0].content.parts[0].text);
      History.push({
        role: "model",
        parts: [{ text: userInput }],
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
    console.log(History);
    askQuestion();
  });
}

askQuestion();
