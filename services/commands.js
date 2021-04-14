const utils = require("../helper/utils");

const commands = {
    init: (cli, config, irConfig) => {
        commands.cli = cli;
        commands.config = config;
        commands.irConfig = irConfig;
    },
    execStream: async (action) => {
        if (!['start', 'stop'].includes(action)) {
            return { error: `No route found for stream/${action}` };
        }

        try {
            let successMessage = await commands.cli.execCommand(commands.config.stream[action], `Stream ${action}`);
            let irAction = action === 'start' ? 'on' : 'off';
            let successMessage2 = '';
            if (irAction === 'on'
                && (utils.compareNow(commands.irConfig.hours.start) < 0
                || utils.compareNow(commands.irConfig.hours.stop) > 0)
            ) {
                successMessage2 = await commands.execIr(irAction);
            } else if (irAction === 'off') {
                successMessage2 = await commands.execIr(irAction);
            }

            if (successMessage2) {
                successMessage += " and " + successMessage2;
            }

            return { success: successMessage };
        } catch (exception) {
            return { error: exception.message };
        }
    },
    execIrWithMessage: (res, action) => {
        if (!['on', 'off'].includes(action)) {
            return res.send({ error: `No route found for ir/${action}` });
        }
        return commands.cli.execWithMessage(res, commands.config.ir[action], `Ir led ${action}`);
    },
    execIr: async (action) => {
        return commands.cli.execCommand(commands.config.ir[action], `Ir led ${action}`);
    },
    execCpuTemp: (res) => {
        commands.cli.execWithMessage(res, commands.config.measure.cpu_temp);
    }
}

module.exports = commands;
