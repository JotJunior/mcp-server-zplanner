import { HelpMessages } from '../help/HelpMessages';
export class TaskCommandHandler {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    }
    registerCommands(program) {
        this.registerAddTask(program);
        this.registerAddSubtask(program);
        this.registerMoveTask(program);
        this.registerCompleteTask(program);
        this.registerPendingTask(program);
    }
    registerAddTask(program) {
        program
            .command('add-task')
            .description('Adiciona uma nova tarefa a uma fase')
            .argument('<phase>', 'ID da fase')
            .argument('<id>', 'ID da tarefa')
            .argument('<nome>', 'Nome da tarefa')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.TASK.ADD)
            .action((phase, id, name) => {
            try {
                this.projectService.addTask(phase, id, name);
                console.log(`Tarefa "${name}" adicionada com sucesso!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
    registerAddSubtask(program) {
        program
            .command('add-subtask')
            .description('Adiciona uma subtarefa a uma tarefa existente')
            .argument('<phase>', 'ID da fase')
            .argument('<parent>', 'ID da tarefa pai')
            .argument('<id>', 'ID da subtarefa')
            .argument('<nome>', 'Nome da subtarefa')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.TASK.ADD_SUBTASK)
            .action((phase, parent, id, name) => {
            try {
                this.projectService.addSubtask(phase, parent, id, name);
                console.log(`Subtarefa "${name}" adicionada com sucesso à tarefa ${parent}!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
    registerMoveTask(program) {
        program
            .command('move-task')
            .description('Move uma tarefa para outra fase')
            .argument('<fase-origem>', 'ID da fase de origem')
            .argument('<fase-destino>', 'ID da fase de destino')
            .argument('<id>', 'ID da tarefa')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.TASK.MOVE)
            .action((sourcePhase, targetPhase, taskId) => {
            try {
                this.projectService.moveTask(sourcePhase, targetPhase, taskId);
                console.log(`Tarefa "${taskId}" movida com sucesso!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
    registerCompleteTask(program) {
        program
            .command('complete')
            .description('Marca uma tarefa como concluída')
            .argument('<fase>', 'ID da fase')
            .argument('<id>', 'ID da tarefa')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.TASK.COMPLETE)
            .action((phase, id) => {
            try {
                this.projectService.completeTask(phase, id);
                console.log(`Tarefa "${id}" marcada como concluída!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
    registerPendingTask(program) {
        program
            .command('pending')
            .description('Marca uma tarefa como pendente')
            .argument('<fase>', 'ID da fase')
            .argument('<id>', 'ID da tarefa')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.TASK.PENDING)
            .action((phase, id) => {
            try {
                this.projectService.pendingTask(phase, id);
                console.log(`Tarefa "${id}" marcada como pendente!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
}
