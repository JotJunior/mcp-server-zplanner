import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
export class FileProjectRepository {
    filePath;
    constructor(projectPath) {
        this.filePath = resolve(projectPath);
    }
    createDefaultProject() {
        return {
            project: 'Novo Projeto',
            last_update: new Date().toLocaleDateString('pt-BR'),
            phases: {}
        };
    }
    load() {
        try {
            if (!existsSync(this.filePath)) {
                const defaultProject = this.createDefaultProject();
                this.save(defaultProject);
                return defaultProject;
            }
            const content = readFileSync(this.filePath, 'utf-8');
            return JSON.parse(content) || this.createDefaultProject();
        }
        catch (error) {
            return this.createDefaultProject();
        }
    }
    save(project) {
        writeFileSync(this.filePath, JSON.stringify(project, null, 2));
    }
}
