const express = require("express");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
  StreamableHTTPServerTransport,
} = require("@modelcontextprotocol/sdk/server/streamableHttp.js");

const { z } = require("zod");
const mysql = require("mysql2");
const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
});
function getServer() {
  const server = new McpServer({
    name: "math-server",
    version: "1.0.0",
  });

  // Register add_two_numbers tool
  server.registerTool(
    "add_two_numbers",
    {
      title: "Add Two Numbers",
      description: "Returns the sum of two numbers",
      inputSchema: {
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
      },
    },
    async ({ a, b }) => {
      const sum = a + b;
      return {
        content: [
          {
            type: "text",
            text: `The sum of ${a} and ${b} is ${sum}`,
          },
        ],
      };
    }
  );
  server.registerTool(
    "add_three_numbers",
    {
      title: "Add three Numbers",
      description: "Returns the sum of three numbers",
      inputSchema: {
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
        c: z.number().describe("Third number"),
      },
    },
    async ({ a, b, c }) => {
      const sum = a + b + c;
      return {
        content: [
          {
            type: "text",
            text: `The sum of ${a} and ${b} and ${c} is ${sum}`,
          },
        ],
      };
    }
  );
  server.registerTool(
    "sql_query",
    {
      title: "Executes sql query",
      description: "Executes a given SQL query",
      inputSchema: {
        t: z.string(),
      },
    },
    async ({ t }) => {
      // Wrap connection.query in a Promise
      return new Promise((resolve, reject) => {
        connection.query(t, (err, results, fields) => {
          if (err) {
            return resolve({
              content: [
                {
                  type: "text",
                  text: `Error: ${err.message}`,
                },
              ],
            });
          }

          // Format results as text or JSON
          return resolve({
            content: [
              {
                type: "text",
                text: JSON.stringify(results),
              },
            ],
          });
        });
      });
    }
  );

  return server;
}

// ----------------- /mcp POST endpoint -----------------
app.post("/mcp", async (req, res) => {
  try {
    const server = getServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      console.log("Request closed");
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// ----------------- GET /mcp not allowed -----------------
app.get("/mcp", async (req, res) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});

// ----------------- DELETE /mcp not allowed -----------------
app.delete("/mcp", async (req, res) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});

// ----------------- Start Server -----------------
const PORT = 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }

  console.log(`MCP Server running at http://localhost:${PORT}/mcp`);
});
