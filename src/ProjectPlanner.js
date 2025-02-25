import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
export class ProjectPlanner {
    project;
    filePath;
    constructor(projectPath) {
        this.filePath = resolve(projectPath);
        this.project = this.loadProject();
    }
    createDefaultProject() {
        return {
            project: 'Novo Projeto',
            last_update: new Date().toLocaleDateString('pt-BR'),
            phases: {}
        };
    }
    loadProject() {
        try {
            if (!existsSync(this.filePath)) {
                const defaultProject = this.createDefaultProject();
                this.saveProject(defaultProject);
                return defaultProject;
            }
            const content = readFileSync(this.filePath, 'utf-8');
            const project = JSON.parse(content);
            return project || this.createDefaultProject();
        }
        catch (error) {
            const defaultProject = this.createDefaultProject();
            this.saveProject(defaultProject);
            return defaultProject;
        }
    }
    saveProject(project) {
        try {
            writeFileSync(this.filePath, JSON.stringify(project, null, 2), 'utf-8');
        }
        catch (error) {
            throw new Error(`Erro ao salvar projeto: ${error}`);
        }
    }
    getProgress() {
        const phases = Object.values(this.project.phases);
        const totalPhases = phases.length;
        const completedPhases = phases.filter(phase => phase.executed).length;
        const tasks = phases.flatMap(phase => phase.tasks);
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.executed).length;
        if (totalTasks === 0)
            return { tasks: 0, phases: 0 };
        return {
            tasks: Number(((completedTasks / totalTasks) * 100).toFixed(1)),
            phases: totalPhases === 0 ? 0 : Number(((completedPhases / totalPhases) * 100).toFixed(1))
        };
    }
    listTasks() {
        return Object.entries(this.project.phases).map(([phaseId, phase]) => ({
            phaseId,
            phase
        }));
    }
    completeTask(phaseId, taskId) {
        const phase = this.project.phases[phaseId];
        if (!phase) {
            throw new Error(`Fase "${phaseId}" não encontrada`);
        }
        const task = phase.tasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error(`Tarefa "${taskId}" não encontrada na fase "${phaseId}"`);
        }
        task.executed = true;
        phase.executed = phase.tasks.every(t => t.executed);
        this.project.last_update = new Date().toLocaleDateString('pt-BR');
        this.saveProject(this.project);
    }
    pendingTask(phaseId, taskId) {
        const phase = this.project.phases[phaseId];
        if (!phase) {
            throw new Error(`Fase "${phaseId}" não encontrada`);
        }
        const task = phase.tasks.find(t => t.id === taskId);
        if (!task) {
            throw new Error(`Tarefa "${taskId}" não encontrada na fase "${phaseId}"`);
        }
        task.executed = false;
        phase.executed = false;
        this.project.last_update = new Date().toLocaleDateString('pt-BR');
        this.saveProject(this.project);
    }
    addPhase(phaseId, name) {
        if (this.project.phases[phaseId]) {
            throw new Error(`Fase "${phaseId}" já existe`);
        }
        this.project.phases[phaseId] = {
            name,
            executed: false,
            tasks: []
        };
        this.project.last_update = new Date().toLocaleDateString('pt-BR');
        this.saveProject(this.project);
    }
    addTask(phaseId, taskId, name) {
        const phase = this.project.phases[phaseId];
        if (!phase) {
            throw new Error(`Fase "${phaseId}" não encontrada`);
        }
        if (phase.tasks.some(t => t.id === taskId)) {
            throw new Error(`Tarefa "${taskId}" já existe na fase "${phaseId}"`);
        }
        phase.tasks.push({
            id: taskId,
            name,
            executed: false,
            created_at: new Date().toLocaleDateString('pt-BR'),
            updated_at: new Date().toLocaleDateString('pt-BR')
        });
        this.project.last_update = new Date().toLocaleDateString('pt-BR');
        this.saveProject(this.project);
    }
    removePhase(phaseId) {
        if (!this.project.phases[phaseId]) {
            throw new Error(`Fase "${phaseId}" não encontrada`);
        }
        delete this.project.phases[phaseId];
        this.project.last_update = new Date().toLocaleDateString('pt-BR');
        this.saveProject(this.project);
    }
    removeTask(phaseId, taskId) {
        const phase = this.project.phases[phaseId];
        if (!phase) {
            throw new Error(`Fase "${phaseId}" não encontrada`);
        }
        const taskIndex = phase.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            throw new Error(`Tarefa "${taskId}" não encontrada na fase "${phaseId}"`);
        }
        phase.tasks.splice(taskIndex, 1);
        this.project.last_update = new Date().toLocaleDateString('pt-BR');
        this.saveProject(this.project);
    }
    findTask(phaseId, taskId) {
        const phase = this.project.phases[phaseId];
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
    addSubtask(phaseId, parentTaskId, subtaskId, name) {
        const { task: parentTask, phase } = this.findTask(phaseId, parentTaskId);
        if (!parentTask || !phase) {
            throw new Error(`Tarefa pai ${parentTaskId} não encontrada na fase ${phaseId}`);
        }
        if (!parentTask.subtasks) {
            parentTask.subtasks = [];
        }
        // Verifica se o ID da subtarefa já existe
        const existingSubtask = this.findTask(phaseId, subtaskId).task;
        if (existingSubtask) {
            throw new Error(`Já existe uma tarefa com o ID ${subtaskId}`);
        }
        const newSubtask = {
            id: subtaskId,
            name,
            executed: false,
            parentId: parentTaskId,
            created_at: new Date().toLocaleDateString('pt-BR'),
            updated_at: new Date().toLocaleDateString('pt-BR')
        };
        parentTask.subtasks.push(newSubtask);
        this.saveProject(this.project);
    }
    listTasksWithSubtasks() {
        return Object.entries(this.project.phases).map(([phaseId, phase]) => ({
            phase: {
                id: phaseId,
                name: phase.name,
                tasks: phase.tasks
            }
        }));
    }
    completeSubtask(phaseId, taskId) {
        const { task } = this.findTask(phaseId, taskId);
        if (!task) {
            throw new Error(`Tarefa ${taskId} não encontrada na fase ${phaseId}`);
        }
        task.executed = true;
        task.updated_at = new Date().toLocaleDateString('pt-BR');
        // Verifica se todas as subtarefas estão concluídas
        if (task.parentId) {
            const { task: parentTask } = this.findTask(phaseId, task.parentId);
            if (parentTask && parentTask.subtasks) {
                const allSubtasksCompleted = parentTask.subtasks.every(st => st.executed);
                if (allSubtasksCompleted) {
                    parentTask.executed = true;
                    parentTask.updated_at = new Date().toLocaleDateString('pt-BR');
                }
            }
        }
        this.saveProject(this.project);
    }
    generateHTML() {
        const css = `
      :root {
        --azul-profundo: #1E2A38;
        --cinza-grafite: #3B3F45;
        --dourado: #CBA36A;
      }
      
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 20px;
        background: #f5f5f5;
        color: var(--azul-profundo);
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      h1 {
        color: var(--azul-profundo);
        border-bottom: 2px solid var(--dourado);
        padding-bottom: 10px;
        margin-bottom: 30px;
      }
      
      .phase {
        margin-bottom: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 6px;
        border-left: 4px solid var(--dourado);
      }
      
      .phase-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      
      .phase-title {
        color: var(--azul-profundo);
        font-size: 1.5em;
        margin: 0;
      }
      
      .task-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .task-item {
        padding: 10px;
        margin: 5px 0;
        background: white;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
      }
      
      .subtask-list {
        margin-left: 30px;
      }
      
      .task-status {
        margin-right: 10px;
        font-size: 1.2em;
      }
      
      .task-info {
        flex-grow: 1;
      }
      
      .task-id {
        color: var(--cinza-grafite);
        font-size: 0.9em;
        margin-right: 10px;
      }
      
      .progress-bar {
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        margin-top: 5px;
      }
      
      .progress-fill {
        height: 100%;
        background: var(--dourado);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
      
      .metadata {
        color: var(--cinza-grafite);
        font-size: 0.8em;
        margin-top: 5px;
      }
    `;
        const generateTaskHTML = (task, level = 0) => {
            const indent = level > 0 ? 'subtask-list' : '';
            const status = task.executed ? '✅' : '⭕';
            const subtasksHtml = task.subtasks?.map(st => generateTaskHTML(st, level + 1)).join('') || '';
            return `
        <div class="task-item ${indent}">
          <span class="task-status">${status}</span>
          <div class="task-info">
            <span class="task-id">${task.id}</span>
            ${task.name}
            <div class="metadata">
              Criado em: ${task.created_at} | Última atualização: ${task.updated_at}
            </div>
            ${subtasksHtml}
          </div>
        </div>
      `;
        };
        const phasesHtml = Object.entries(this.project.phases).map(([phaseId, phase]) => {
            const tasksHtml = phase.tasks.map(task => generateTaskHTML(task)).join('');
            const completedTasks = phase.tasks.filter(t => t.executed).length;
            const totalTasks = phase.tasks.length;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            return `
        <div class="phase" id="phase-${phaseId}">
          <div class="phase-header">
            <h2 class="phase-title">${phase.name}</h2>
            <div>${completedTasks}/${totalTasks} tarefas concluídas</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="task-list">
            ${tasksHtml}
          </div>
        </div>
      `;
        }).join('');
        return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>zPlanner - Visualização do Projeto</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>${css}</style>
      </head>
      <body>
        <div class="container">
          <h1>zPlanner - ${this.project.project}</h1>
          <div class="metadata">Última atualização: ${this.project.last_update}</div>
          ${phasesHtml}
        </div>
      </body>
      </html>
    `;
    }
    getLastUpdate() {
        return this.project.last_update;
    }
}
