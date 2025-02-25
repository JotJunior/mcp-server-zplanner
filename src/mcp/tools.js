export const tools = [
    {
        name: 'create_project',
        description: 'Create a new project in zPlanner',
        parameters: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'Name of the project'
                }
            }
        }
    },
    {
        name: 'add_phase',
        description: 'Add a new phase to the project',
        parameters: {
            type: 'object',
            properties: {
                phaseId: {
                    type: 'string',
                    description: 'Unique identifier for the phase'
                },
                name: {
                    type: 'string',
                    description: 'Name of the phase'
                }
            }
        }
    },
    {
        name: 'add_task',
        description: 'Add a new task to a phase',
        parameters: {
            type: 'object',
            properties: {
                phaseId: {
                    type: 'string',
                    description: 'ID of the phase to add the task to'
                },
                taskId: {
                    type: 'string',
                    description: 'Unique identifier for the task'
                },
                name: {
                    type: 'string',
                    description: 'Name of the task'
                }
            }
        }
    },
    {
        name: 'complete_task',
        description: 'Mark a task as completed',
        parameters: {
            type: 'object',
            properties: {
                phaseId: {
                    type: 'string',
                    description: 'ID of the phase containing the task'
                },
                taskId: {
                    type: 'string',
                    description: 'ID of the task to complete'
                }
            }
        }
    },
    {
        name: 'list_tasks',
        description: 'List all tasks in the project grouped by phases',
        parameters: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'get_progress',
        description: 'Get the progress of tasks and phases in the project',
        parameters: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'export_html',
        description: 'Export the project to HTML format',
        parameters: {
            type: 'object',
            properties: {}
        }
    }
];
