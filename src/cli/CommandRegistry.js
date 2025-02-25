export class CommandRegistry {
    handlers = [];
    addHandler(handler) {
        this.handlers.push(handler);
    }
    registerAll(program) {
        this.handlers.forEach(handler => handler.registerCommands(program));
    }
}
