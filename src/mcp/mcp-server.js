const { Server } = require("@modelcontextprotocol/sdk/server");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio");
const { ProjectPlanner } = require("../dist/ProjectPlanner.js");
const path = require("path");

const server = new Server(
  {
    name: "zplanner-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler("list_tools", async () => {
  return {
    tools: [
      {
        name: "create_project",
        description: "Create a new project in zPlanner",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the project"
            }
          }
        }
      },
      {
        name: "add_phase",
        description: "Add a new phase to the project",
        parameters: {
          type: "object",
          properties: {
            phaseId: {
              type: "string",
              description: "Unique identifier for the phase"
            },
            name: {
              type: "string",
              description: "Name of the phase"
            }
          }
        }
      }
    ],
  };
});

server.setRequestHandler("call_tool", async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "create_project": {
        const args = request.params.arguments;
        planner.addPhase('main', args.name);
        return {
          content: [{ type: "text", text: JSON.stringify({ message: "Project created successfully" }) }],
        };
      }

      case "add_phase": {
        const args = request.params.arguments;
        planner.addPhase(args.phaseId, args.name);
        return {
          content: [{ type: "text", text: JSON.stringify({ message: "Phase added successfully" }) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    throw new Error(`Error executing tool: ${error.message}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("zPlanner MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
