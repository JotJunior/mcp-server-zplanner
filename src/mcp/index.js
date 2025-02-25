#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { ProjectPlanner } from '../ProjectPlanner.js';
import path from 'path';
import { CreateProjectSchema, AddPhaseSchema, AddTaskSchema, CompleteTaskSchema, ListTasksSchema, GetProgressSchema, ExportHTMLSchema, } from './schemas.js';
const planner = new ProjectPlanner(path.join(process.cwd(), 'planner.json'));
const server = new Server({
    name: "mcp-server-zplanner",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "create_project",
                description: "Create a new project in zPlanner",
                inputSchema: zodToJsonSchema(CreateProjectSchema),
            },
            {
                name: "add_phase",
                description: "Add a new phase to the project",
                inputSchema: zodToJsonSchema(AddPhaseSchema),
            },
            {
                name: "add_task",
                description: "Add a new task to a phase",
                inputSchema: zodToJsonSchema(AddTaskSchema),
            },
            {
                name: "complete_task",
                description: "Mark a task as completed",
                inputSchema: zodToJsonSchema(CompleteTaskSchema),
            },
            {
                name: "list_tasks",
                description: "List all tasks in the project grouped by phases",
                inputSchema: zodToJsonSchema(ListTasksSchema),
            },
            {
                name: "get_progress",
                description: "Get the progress of tasks and phases in the project",
                inputSchema: zodToJsonSchema(GetProgressSchema),
            },
            {
                name: "export_html",
                description: "Export the project to HTML format",
                inputSchema: zodToJsonSchema(ExportHTMLSchema),
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        if (!request.params.arguments) {
            throw new Error("Arguments are required");
        }
        switch (request.params.name) {
            case "create_project": {
                const args = CreateProjectSchema.parse(request.params.arguments);
                planner.addPhase('main', args.name);
                return {
                    content: [{ type: "text", text: JSON.stringify({ message: "Project created successfully" }) }],
                };
            }
            case "add_phase": {
                const args = AddPhaseSchema.parse(request.params.arguments);
                planner.addPhase(args.phaseId, args.name);
                return {
                    content: [{ type: "text", text: JSON.stringify({ message: "Phase added successfully" }) }],
                };
            }
            case "add_task": {
                const args = AddTaskSchema.parse(request.params.arguments);
                planner.addTask(args.phaseId, args.taskId, args.name);
                return {
                    content: [{ type: "text", text: JSON.stringify({ message: "Task added successfully" }) }],
                };
            }
            case "complete_task": {
                const args = CompleteTaskSchema.parse(request.params.arguments);
                planner.completeTask(args.phaseId, args.taskId);
                return {
                    content: [{ type: "text", text: JSON.stringify({ message: "Task completed successfully" }) }],
                };
            }
            case "list_tasks": {
                const tasks = planner.listTasks();
                return {
                    content: [{ type: "text", text: JSON.stringify(tasks) }],
                };
            }
            case "get_progress": {
                const progress = planner.getProgress();
                return {
                    content: [{ type: "text", text: JSON.stringify(progress) }],
                };
            }
            case "export_html": {
                const html = planner.generateHTML();
                return {
                    content: [{ type: "text", text: html }],
                };
            }
            default:
                throw new Error(`Unknown tool: ${request.params.name}`);
        }
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
        }
        throw error;
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
