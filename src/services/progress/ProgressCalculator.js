export class ProgressCalculator {
    phaseService;
    constructor(phaseService) {
        this.phaseService = phaseService;
    }
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
    calculatePhaseProgress(phase) {
        const progress = this.phaseService.calculatePhaseProgress(phase);
        return {
            ...progress,
            percentage: progress.total > 0 ? (progress.completed / progress.total) * 100 : 0
        };
    }
}
