export class TaskService {
    findTask(project, phaseId, taskId) {
        const phase = project.phases[phaseId];
        if (!phase)
            return { task: null, phase: null };
        const findTaskRecursive = (tasks) => {
            for (const task of tasks) {
                if (task.id === taskId)
                    return task;
                if (task.subtasks) {
                    const found = findTaskRecursive(task.subtasks);
                    if (found)
                        return found;
                }
            }
            return null;
        };
        return { task: findTaskRecursive(phase.tasks), phase };
    }
    createTask(id, name, parentId) {
        return {
            id,
            name,
            executed: false,
            parentId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    addTask(phase, id, name) {
        const task = this.createTask(id, name);
        phase.tasks.push(task);
    }
    updateTaskStatus(task, executed) {
        task.executed = executed;
        task.updated_at = new Date().toISOString();
    }
    renameTask(task, newName) {
        task.name = newName;
        task.updated_at = new Date().toISOString();
    }
    moveTask(phase, taskId, newPosition) {
        const taskIndex = phase.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1 || newPosition < 0 || newPosition >= phase.tasks.length) {
            return false;
        }
        const [task] = phase.tasks.splice(taskIndex, 1);
        phase.tasks.splice(newPosition, 0, task);
        return true;
    }
    moveTaskBetweenPhases(sourcePhase, targetPhase, taskId, newPosition) {
        const taskIndex = sourcePhase.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1 || newPosition < 0 || newPosition > targetPhase.tasks.length) {
            return false;
        }
        const [task] = sourcePhase.tasks.splice(taskIndex, 1);
        targetPhase.tasks.splice(newPosition, 0, task);
        return true;
    }
    findTaskById(phase, taskId) {
        return phase.tasks.find(t => t.id === taskId);
    }
}
