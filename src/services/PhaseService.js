export class PhaseService {
    createPhase(name) {
        return {
            name,
            executed: false,
            tasks: []
        };
    }
    renamePhase(phase, newName) {
        phase.name = newName;
    }
    movePhase(project, phaseId, newPosition) {
        const phases = Object.entries(project.phases);
        const currentIndex = phases.findIndex(([id]) => id === phaseId);
        if (currentIndex === -1 || newPosition < 0 || newPosition >= phases.length) {
            return false;
        }
        const [movedPhaseId, movedPhase] = phases[currentIndex];
        phases.splice(currentIndex, 1);
        phases.splice(newPosition, 0, [movedPhaseId, movedPhase]);
        // Reconstruir o objeto phases
        project.phases = phases.reduce((acc, [id, phase]) => {
            acc[id] = phase;
            return acc;
        }, {});
        return true;
    }
    removePhase(project, phaseId) {
        if (!project.phases[phaseId])
            return false;
        delete project.phases[phaseId];
        return true;
    }
    calculatePhaseProgress(phase) {
        let completed = 0;
        let total = 0;
        const countTasks = (tasks) => {
            for (const task of tasks) {
                total++;
                if (task.executed)
                    completed++;
                if (task.subtasks) {
                    countTasks(task.subtasks);
                }
            }
        };
        countTasks(phase.tasks);
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        return { completed, total, percentage };
    }
}
