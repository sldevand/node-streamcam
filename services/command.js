const util = require("util");
const exec = util.promisify(require("child_process").exec);

const command = {
    execWithMessage: function (res, command, defaultSuccessMsg) {
        exec(command, (error, stdout, stderr) => {
            if (this.manageError(res, error, stdout, stderr)) {
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
    execCommand: async function (command, defaultSuccessMsg) {
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
    manageError: function (res, error, stdout, stderr) {
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

module.exports = command;
