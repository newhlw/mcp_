const { Client } = require("@modelcontextprotocol/sdk/client/index.js");

const { GoogleGenAI, Type } = require("@google/genai");
const {
  StreamableHTTPClientTransport,
} = require("@modelcontextprotocol/sdk/client/streamableHttp.js");

const readline = require("readline");

require("dotenv").config();
// Put your Gemini API key here
// const ex = [
//   {
//     functionDeclarations: [
//       {
//         name: "get_weather_forecast",
//         description:
//           "Gets the current weather temperature for a given location.",
//         parameters: {
//           type: Type.OBJECT,
//           properties: {
//             location: {
//               type: Type.STRING,
//             },
//           },
//           required: ["location"],
//         },
//       },
//       {
//         name: "set_thermostat_temperature",
//         description: "Sets the thermostat to a desired temperature.",
//         parameters: {
//           type: Type.OBJECT,
//           properties: {
//             temperature: {
//               type: Type.NUMBER,
//             },
//           },
//           required: ["temperature"],
//         },
//       },
//     ],
//   },
// ];
let tools;
let config;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let history = [];
// Connect to server
const baseUrl = new URL("http://localhost:3000/mcp");
let client;
let transport;
try {
  client = new Client({
    name: "stock-client",
    version: "1.0.0",
  });
  transport = new StreamableHTTPClientTransport(new URL(baseUrl));
  client.connect(transport).then(async () => {
    console.log("Connected using Streamable HTTP transport");
    const chool = await client.listTools();
    tools = chool.tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: tool.inputSchema.type,
          properties: tool.inputSchema.properties,
          required: tool.inputSchema.required,
        },
      };
    });
    console.log(tools);
    config = {
      tools: [
        {
          functionDeclarations: tools,
        },
      ],
    };
  });
} catch (err) {
  console.log(err);
}

// Get user input

async function main() {
  rl.question("Ask something (stock or numbers): ", async (input) => {
    const contents = [
      {
        role: "user",
        parts: [{ text: input }],
      },
    ];
    history.push(contents[0]);
    let aiResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: config,
    });
    // console.log("aiResult");
    // console.log(aiResult);
    // console.log("aiResult.candidates");
    // console.log(aiResult.candidates);
    console.log("aiResult.candidates[0].content");
    console.log(aiResult.candidates[0].content);
    console.log("aiResult.candidates[0].content.parts");
    console.log(aiResult.candidates[0].content.parts);
    console.log("aiResult.candidates[0].content.parts[0]");
    console.log(aiResult.candidates[0].content.parts[0]);
    console.log("aiResult.candidates[0].content.parts[0].functionCall");
    console.log(aiResult.candidates[0].content.parts[0].functionCall);
    const fc = aiResult.candidates[0].content.parts;
    history.push(aiResult.candidates[0].content);
    if (fc) {
      const result = await Promise.all(
        fc.map(async (obj) => {
          if (obj.functionCall) {
            console.log("function call");
            const res = await client.callTool({
              name: obj.functionCall.name,
              arguments: obj.functionCall.args,
            });
            console.log("Response func start");
            console.log(res);
            console.log("Response func end");
            history.push({
              role: "model",
              parts: [{ text: res.content[0].text }],
            });
            console.log(res);
          } else {
            console.log("not function call");

            console.log(obj);
          }
        })
      );
    
    }

    main();
  });
}

main().catch((err) => console.log(err));
