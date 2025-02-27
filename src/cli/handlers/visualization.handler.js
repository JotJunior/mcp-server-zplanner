import { HelpMessages } from '../help/HelpMessages';
export class VisualizationCommandHandler {
    projectService;
    htmlExporter;
    constructor(projectService, htmlExporter) {
        this.projectService = projectService;
        this.htmlExporter = htmlExporter;
    }
    registerCommands(program) {
        this.registerList(program);
        this.registerProgress(program);
        this.registerExportHTML(program);
    }
    registerList(program) {
        program
            .command('list')
            .description('Lista todas as fases, tarefas e subtarefas')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.VISUALIZATION.LIST)
            .action(() => {
            const project = this.projectService.getProject();
            const phases = project.phases;
            Object.values(phases).forEach(phase => {
                console.log(`\n📦 ${phase.name}:`);
                if (phase.tasks.length === 0) {
                    console.log('   Nenhuma tarefa');
                }
                else {
                    const printTask = (task, level = 0) => {
                        const indent = '   '.repeat(level + 1);
                        const status = task.executed ? '✅' : '⭕';
                        console.log(`${indent}${status} ${task.id}: ${task.name}`);
                        if (task.subtasks) {
                            task.subtasks.forEach((subtask) => printTask(subtask, level + 1));
                        }
                    };
                    phase.tasks.forEach((task) => printTask(task));
                }
            });
        });
    }
    registerProgress(program) {
        program
            .command('progress')
            .description('Mostra o progresso detalhado do projeto')
            .option('-d, --detailed', 'Mostra progresso detalhado')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.VISUALIZATION.PROGRESS)
            .action((options) => {
            if (options.detailed) {
                const progress = this.projectService.getDetailedProgress();
                console.log('\n📊 Progresso Detalhado do Projeto:');
                console.log('\n🔄 Progresso Geral:');
                console.log(`  - Tarefas: ${progress.geral.tasks.toFixed(1)}%`);
                console.log(`  - Fases: ${progress.geral.phases.toFixed(1)}%\n`);
                console.log('📑 Progresso por Fase:');
                Object.entries(progress.fases).forEach(([id, fase]) => {
                    console.log(`\n  ${fase.nome} (${id}):`);
                    console.log(`    Progresso: ${fase.progresso.toFixed(1)}%`);
                    console.log(`    Status: ${fase.status}`);
                    console.log(`    Tarefas:`);
                    console.log(`      ⭕ Pendentes: ${fase.tarefas.pendentes}`);
                    console.log(`      🔄 Em andamento: ${fase.tarefas.emAndamento}`);
                    console.log(`      ✅ Concluídas: ${fase.tarefas.concluidas}`);
                });
            }
            else {
                const progress = this.projectService.getProgress();
                console.log('\n📊 Progresso do Projeto:');
                console.log(`- Tarefas: ${progress.tasks.toFixed(1)}%`);
                console.log(`- Fases: ${progress.phases.toFixed(1)}%`);
            }
        });
    }
    registerExportHTML(program) {
        program
            .command('export-html')
            .description('Exporta o projeto para um arquivo HTML')
            .argument('[output]', 'Caminho do arquivo de saída', 'zplanner.html')
            .helpOption('-h, --help', 'Exibe ajuda do comando')
            .addHelpText('after', HelpMessages.VISUALIZATION.EXPORT)
            .action((output) => {
            try {
                this.htmlExporter.exportToHTML(this.projectService.getProject(), output);
                console.log(`Projeto exportado com sucesso para ${output}`);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(`Erro ao exportar: ${error.message}`);
                }
            }
        });
    }
}
