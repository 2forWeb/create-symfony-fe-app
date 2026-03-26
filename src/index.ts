import { Application } from './application';

const app = new Application();

app.printWelcomeMessage();
app.printOptions();

app.startInputLoop();
