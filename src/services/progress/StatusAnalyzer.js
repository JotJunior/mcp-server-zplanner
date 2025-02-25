export class StatusAnalyzer {
    phaseService;
    constructor(phaseService) {
        this.phaseService = phaseService;
    }
    getPhaseStatus(phase) {
        const progress = this.phaseService.calculatePhaseProgress(phase);
        const percentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
        const pendentes = phase.tasks.filter(t => !t.executed).length;
        const concluidas = phase.tasks.filter(t => t.executed).length;
        const emAndamento = phase.tasks.length - (pendentes + concluidas);
        let status = 'não iniciada';
        if (percentage === 100) {
            status = 'concluída';
        }
        else if (percentage > 0) {
            status = 'em andamento';
        }
        return {
            progress: percentage,
            status,
            taskStats: {
                pendentes,
                emAndamento,
                concluidas
            }
        };
    }
}
