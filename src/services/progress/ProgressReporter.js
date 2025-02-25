export class ProgressReporter {
    calculator;
    analyzer;
    constructor(calculator, analyzer) {
        this.calculator = calculator;
        this.analyzer = analyzer;
    }
    getDetailedProgress(project) {
        const progress = this.calculator.calculateProjectProgress(project);
        const fases = {};
        Object.entries(project.phases).forEach(([phaseId, phase]) => {
            const phaseStatus = this.analyzer.getPhaseStatus(phase);
            fases[phaseId] = {
                nome: phase.name,
                progresso: phaseStatus.progress,
                status: phaseStatus.status,
                tarefas: phaseStatus.taskStats
            };
        });
        return {
            geral: {
                tasks: progress.tasks.percentage,
                phases: progress.phases.percentage
            },
            fases
        };
    }
    getBasicProgress(project) {
        const progress = this.calculator.calculateProjectProgress(project);
        return {
            tasks: progress.tasks.percentage,
            phases: progress.phases.percentage
        };
    }
}
