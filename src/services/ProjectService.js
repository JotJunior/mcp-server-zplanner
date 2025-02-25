import { TaskService } from './TaskService';
import { PhaseService } from './PhaseService';
import { ProgressService } from './ProgressService';
export class ProjectService {
    repository;
    project;
    taskService;
    phaseService;
    progressService;
    constructor(repository, taskService, phaseService, progressService) {
        this.repository = repository;
        this.project = this.repository.load();
        this.taskService = taskService || new TaskService();
        this.phaseService = phaseService || new PhaseService();
        this.progressService = progressService || new ProgressService(this.taskService, this.phaseService);
    }
    addPhase(id, name) {
        if (this.project.phases[id]) {
            throw new Error(`Fase ${id} já existe`);
        }
        this.project.phases[id] = this.phaseService.createPhase(name);
        this.updateAndSave();
    }
    renamePhase(id, newName) {
        const phase = this.project.phases[id];
        if (!phase) {
            throw new Error(`Fase ${id} não encontrada`);
        }
        this.phaseService.renamePhase(phase, newName);
        this.updateAndSave();
    }
    movePhase(id, newPosition) {
        if (this.phaseService.movePhase(this.project, id, newPosition)) {
            this.updateAndSave();
        }
        else {
            throw new Error(`Não foi possível mover a fase ${id}`);
        }
    }
    removePhase(id) {
        if (this.phaseService.removePhase(this.project, id)) {
            this.updateAndSave();
        }
        else {
            throw new Error(`Fase ${id} não encontrada`);
        }
    }
    addTask(phaseId, taskId, name) {
        const phase = this.project.phases[phaseId];
        if (!phase) {
            throw new Error(`Fase ${phaseId} não encontrada`);
        }
        const task = this.taskService.createTask(taskId, name);
        phase.tasks.push(task);
        this.updateAndSave();
    }
    addSubtask(phaseId, parentTaskId, subtaskId, name) {
        const { task: parentTask } = this.taskService.findTask(this.project, phaseId, parentTaskId);
        if (!parentTask) {
            throw new Error(`Tarefa pai ${parentTaskId} não encontrada na fase ${phaseId}`);
        }
        if (!parentTask.subtasks) {
            parentTask.subtasks = [];
        }
        const subtask = this.taskService.createTask(subtaskId, name, parentTaskId);
        parentTask.subtasks.push(subtask);
        this.updateAndSave();
    }
    moveTask(sourcePhaseId, targetPhaseId, taskId) {
        const sourcePhase = this.project.phases[sourcePhaseId];
        const targetPhase = this.project.phases[targetPhaseId];
        if (!sourcePhase || !targetPhase) {
            throw new Error('Fase de origem ou destino não encontrada');
        }
        const targetPosition = targetPhase.tasks.length;
        if (this.taskService.moveTaskBetweenPhases(sourcePhase, targetPhase, taskId, targetPosition)) {
            this.updateAndSave();
        }
        else {
            throw new Error(`Tarefa ${taskId} não encontrada na fase ${sourcePhaseId}`);
        }
    }
    completeTask(phaseId, taskId) {
        const { task } = this.taskService.findTask(this.project, phaseId, taskId);
        if (!task) {
            throw new Error(`Tarefa ${taskId} não encontrada na fase ${phaseId}`);
        }
        this.taskService.updateTaskStatus(task, true);
        this.updateAndSave();
    }
    pendingTask(phaseId, taskId) {
        const { task } = this.taskService.findTask(this.project, phaseId, taskId);
        if (!task) {
            throw new Error(`Tarefa ${taskId} não encontrada na fase ${phaseId}`);
        }
        this.taskService.updateTaskStatus(task, false);
        this.updateAndSave();
    }
    getProgress() {
        const progress = this.progressService.calculateProjectProgress(this.project);
        return {
            tasks: progress.tasks.percentage,
            phases: progress.phases.percentage
        };
    }
    getDetailedProgress() {
        return this.progressService.getDetailedProgress(this.project);
    }
    updateAndSave() {
        this.project.last_update = new Date().toLocaleDateString('pt-BR');
        this.repository.save(this.project);
    }
    getProject() {
        return this.project;
    }
}
