module.exports = {
    name: "setafk",
    execute(message, args) {
        let clientUser = message.client.user;

        if (args[0] == "true") {
            clientUser.setActivity(crypto.randomBytes(40).toString('hex'));
        } else {
            clientUser.setActivity("feel free to dm");
        }
    }  
};