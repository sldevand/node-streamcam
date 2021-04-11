const commands = {
    init: (cli, config) => {
        commands.cli = cli;
        commands.config = config;
    },
    execStream: async (res, action) => {
        if (!['start', 'stop'].includes(action)) {
            return res.send({ error: `No route found for stream/${action}` });
        }

        try {
            let successMessage = await commands.cli.execCommand(commands.config.stream.start, `Stream ${action}`);
            let irAction = action === 'start' ? 'on' : 'off';
            let successMessage2 = await commands.execIr(irAction);
            if (successMessage2) {
                successMessage += " and " + successMessage2;
            }

            res.send({ success: successMessage });
        } catch (exception) {
            res.send({ error: exception.message });
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
    execCpuTemp : (res) => {
        commands.cli.execWithMessage(res, commands.config.measure.cpu_temp);
    }
}

module.exports = commands;
