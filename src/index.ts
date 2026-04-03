import { Application } from './application';

const app = new Application();

app.printWelcomeMessage();

app.parseParameters();

if (app.noInteractive) {
    app.runTasks();
} else {
    app.printInstructions();
    app.startInputLoop();
}
