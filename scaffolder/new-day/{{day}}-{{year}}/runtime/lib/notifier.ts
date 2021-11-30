const chalk = require('chalk');
const notifier = require('node-notifier');

export const notify = (msg) => {
    const now = new Date();
    console.log(chalk.cyanBright(`[${now.toLocaleTimeString()}]`), msg);
    notifier.notify(msg);
}