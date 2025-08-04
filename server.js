// const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
// const {
//   StdioServerTransport,
// } = require("@modelcontextprotocol/sdk/server/stdio.js");
// const { z } = require("zod");
// const fs = require("fs/promises");
// const path = require("path");

// const server = new McpServer({
//   name: "enhanced-server",
//   version: "1.0.0",
// });

// // Simple math tool
// server.registerTool(
//   "get_stock_price",
//   {
//     title: "Get Stock Price",
//     description: "Get current stock price and recent data for a given symbol",
//     inputSchema: {
//       symbol: z.string().describe("Stock symbol (e.g., AAPL, GOOGL, TSLA)"),
//     },
//   },
//   async ({ symbol }) => {
//     try {
//       // Simulate fetching real stock data
//       // In production, use APIs like Alpha Vantage, Yahoo Finance, or IEX Cloud
//       const mockStockData = {
//         AAPL: {
//           price: 185.43,
//           change: +2.15,
//           changePercent: +1.17,
//           volume: 45234567,
//         },
//         GOOGL: {
//           price: 142.87,
//           change: -1.23,
//           changePercent: -0.85,
//           volume: 23456789,
//         },
//         TSLA: {
//           price: 248.99,
//           change: +5.67,
//           changePercent: +2.33,
//           volume: 67890123,
//         },
//         MSFT: {
//           price: 378.22,
//           change: +1.88,
//           changePercent: +0.5,
//           volume: 34567890,
//         },
//         AMZN: {
//           price: 145.67,
//           change: -0.89,
//           changePercent: -0.61,
//           volume: 28901234,
//         },
//         NVDA: {
//           price: 892.15,
//           change: +12.45,
//           changePercent: +1.42,
//           volume: 45678901,
//         },
//       };

//       const symbolUpper = symbol.toUpperCase();
//       const stockData = mockStockData[symbolUpper];

//       if (!stockData) {
//         return {
//           content: [
//             {
//               type: "text",
//               text: `Stock symbol ${symbolUpper} not found. Available symbols: ${Object.keys(
//                 mockStockData
//               ).join(", ")}`,
//             },
//           ],
//         };
//       }

//       const currentTime = new Date().toLocaleString();
//       const response = {
//         symbol: symbolUpper,
//         price: stockData.price,
//         change: stockData.change,
//         changePercent: stockData.changePercent,
//         volume: stockData.volume,
//         timestamp: currentTime,
//         status: stockData.change >= 0 ? "📈 UP" : "📉 DOWN",
//       };

//       return {
//         content: [
//           {
//             type: "text",
//             text: JSON.stringify(response, null, 2),
//           },
//         ],
//       };
//     } catch (error) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: `Error fetching stock data: ${error.message}`,
//           },
//         ],
//       };
//     }
//   }
// );

// // File operations toolconst
// // Read file tool

// // Data analysis tool
// server.registerTool(
//   "analyze_numbers",
//   {
//     title: "Analyze Numbers",
//     description: "Perform statistical analysis on an array of numbers",
//     inputSchema: { numbers: z.array(z.number()) },
//   },
//   async ({ numbers }) => {
//     const sum = numbers.reduce((a, b) => a + b, 0);
//     const mean = sum / numbers.length;
//     const sorted = [...numbers].sort((a, b) => a - b);
//     const median =
//       sorted.length % 2 === 0
//         ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
//         : sorted[Math.floor(sorted.length / 2)];
//     const min = Math.min(...numbers);
//     const max = Math.max(...numbers);

//     const analysis = {
//       count: numbers.length,
//       sum,
//       mean: parseFloat(mean.toFixed(2)),
//       median,
//       min,
//       max,
//       range: max - min,
//     };

//     return {
//       content: [
//         {
//           type: "text",
//           text: JSON.stringify(analysis, null, 2),
//         },
//       ],
//     };
//   }
// );

// // Web scraping simulation tool

// // Task execution tool

// const transport = new StdioServerTransport();
// server
//   .connect(transport)
//   .then(() => console.log("Enhanced server started"))
//   .catch((err) => console.error("Server error:", err));
