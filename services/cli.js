const util = require("util");
const exec = util.promisify(require("child_process").exec);

const cli = {
    execWithMessage: (res, command, defaultSuccessMsg) => {
        exec(command, (error, stdout, stderr) => {
            if (cli.manageError(res, error, stdout, stderr)) {
                return;
            }
            let successMessage = "";
            if (!successMessage && stdout) {
                successMessage = stdout.trim();
            } else {
                successMessage = defaultSuccessMsg;
            }

            res.send({ success: successMessage });
        });
    },
    execCommand: async (command, defaultSuccessMsg) => {
        try {
            const { stdout, stderr } = await exec(command);
            if (stderr) {
                throw new Error(stderr.message);
            }

            let successMessage = !defaultSuccessMsg && stdout
                ? stdout.trim()
                : defaultSuccessMsg;

            return successMessage;
        } catch (error) {
            return error.message;
        }
    },
    manageError: (res, error, stdout, stderr) => {
        if (error) {
            res.send({ error: error.message });
            return true;
        }
        if (stderr) {
            res.send({ error: stdout.message });
            return true;
        }

        return false;
    }
}

module.exports = cli;