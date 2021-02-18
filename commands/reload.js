module.exports = {
    name: "reload",
    execute(message, args) {
        let toReload = args[0];

        let commands = message.client.commands;

        try {
            delete require.cache[require.resolve(`./${toReload}.js`)];
            commands.delete(toReload);
            let pull = require(`./${toReload}.js`);
            commands.set(toReload, pull);

            message.channel.send(`Successfully reloaded \`${toReload}\` :sunglasses:`);
        } catch (e) {
            message.channel.send(`Something went wrong while reloading \`${toReload}\``);
        }
    }
};