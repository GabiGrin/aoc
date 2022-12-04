const chalk = require('chalk');
const notifier = require('node-notifier');

export const notify = (msg) => {
    const now = new Date();
    notifier.notify(msg);
    console.log(chalk.cyanBright(`[${now.toLocaleTimeString()}]`), msg);
}