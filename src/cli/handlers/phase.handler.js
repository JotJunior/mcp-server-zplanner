import { HelpMessages } from '../help/HelpMessages';
export class PhaseCommandHandler {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    }
    registerCommands(program) {
        this.registerAddPhase(program);
        this.registerRenamePhase(program);
        this.registerMovePhase(program);
        this.registerRemovePhase(program);
    }
    registerAddPhase(program) {
        program
            .command('add-phase')
            .description('Adiciona uma nova fase ao projeto')
            .argument('<id>', 'ID da fase')
            .argument('<nome>', 'Nome da fase')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.PHASE.ADD)
            .action((id, name) => {
            try {
                this.projectService.addPhase(id, name);
                console.log(`Fase "${name}" adicionada com sucesso!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
    registerRenamePhase(program) {
        program
            .command('rename-phase')
            .description('Renomeia uma fase existente')
            .argument('<id>', 'ID da fase')
            .argument('<novo-nome>', 'Novo nome da fase')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.PHASE.RENAME)
            .action((id, newName) => {
            try {
                this.projectService.renamePhase(id, newName);
                console.log(`Fase renomeada para "${newName}" com sucesso!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
    registerMovePhase(program) {
        program
            .command('move-phase')
            .description('Move uma fase para uma nova posição')
            .argument('<id>', 'ID da fase')
            .argument('<posicao>', 'Nova posição (número)')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.PHASE.MOVE)
            .action((id, position) => {
            try {
                this.projectService.movePhase(id, parseInt(position, 10));
                console.log(`Fase "${id}" movida com sucesso!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
    registerRemovePhase(program) {
        program
            .command('remove-phase')
            .description('Remove uma fase do projeto')
            .argument('<id>', 'ID da fase')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.PHASE.REMOVE)
            .action((id) => {
            try {
                this.projectService.removePhase(id);
                console.log(`Fase "${id}" removida com sucesso!`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro: ${error.message}`);
                }
            }
        });
    }
}
