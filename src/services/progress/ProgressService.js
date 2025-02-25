import { ProgressCalculator } from './ProgressCalculator';
export class ProgressService {
    taskService;
    phaseService;
    calculator;
    constructor(taskService, phaseService) {
        this.taskService = taskService;
        this.phaseService = phaseService;
        this.calculator = new ProgressCalculator(phaseService);
    }
    /**
     * Calcula o progresso total do projeto
     * @param project Projeto a ser analisado
     * @returns Objeto com estatísticas de progresso
     */
    calculateProjectProgress(project) {
        let tasksCompleted = 0;
        let tasksTotal = 0;
        let phasesCompleted = 0;
        const phasesTotal = Object.keys(project.phases).length;
        Object.values(project.phases).forEach(phase => {
            const phaseProgress = this.phaseService.calculatePhaseProgress(phase);
            tasksCompleted += phaseProgress.completed;
            tasksTotal += phaseProgress.total;
            if (phaseProgress.completed === phaseProgress.total && phaseProgress.total > 0) {
                phasesCompleted++;
            }
        });
        return {
            tasks: {
                completed: tasksCompleted,
                total: tasksTotal,
                percentage: tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0
            },
            phases: {
                completed: phasesCompleted,
                total: phasesTotal,
                percentage: phasesTotal > 0 ? (phasesCompleted / phasesTotal) * 100 : 0
            }
        };
    }
    /**
     * Retorna o status detalhado de uma fase
     * @param phase Fase a ser analisada
     * @returns Objeto com progresso, status e estatísticas
     */
    getPhaseStatus(phase) {
        const progress = this.phaseService.calculatePhaseProgress(phase);
        const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
        let status = 'não iniciada';
        if (percentage === 100) {
            status = 'concluída';
        }
        else if (percentage > 0) {
            status = 'em andamento';
        }
        const taskStats = {
            pendentes: phase.tasks.filter(t => !t.executed).length,
            emAndamento: phase.tasks.filter(t => !t.executed && t.id !== '').length,
            concluidas: phase.tasks.filter(t => t.executed).length
        };
        return {
            progress: percentage,
            status,
            taskStats
        };
    }
    /**
     * Gera um relatório detalhado do progresso do projeto
     * @param project Projeto a ser analisado
     * @returns Objeto com informações detalhadas de progresso
     */
    getDetailedProgress(project) {
        const projectProgress = this.calculateProjectProgress(project);
        const phaseDetails = {};
        Object.entries(project.phases).forEach(([phaseName, phase]) => {
            phaseDetails[phaseName] = this.getPhaseStatus(phase);
        });
        return {
            projectProgress,
            phaseDetails
        };
    }
}
