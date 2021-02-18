module.exports = {
    name: "purge",
    async execute(message, args) {
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        //console.log(member);
        if (member && message.member.hasPermission("MANAGE_MESSAGES")) {
            await message.channel.fetchMessages({ limit: args[1] }).then((messages) => { messages.forEach(msg => { if (msg.author.id == member.user.id) { msg.delete() } } ) });
            console.log(`[Sniper | MessagePurge | Purging] Amount: ${args[1]} | From: ${member.user.tag}`);
        } else if (!member && message.member.hasPermission("MANAGE_MESSAGES")) {
            await message.channel.fetchMessages({ limit: args[0] }).then((messages) => { messages.forEach(msg => { msg.delete() }) });
            console.log(`[Sniper | MessagePurge | Purging] Amount: ${args[0]} | From: everyone`);
        } else if (!member && !message.member.hasPermission("MANAGE_MESSAGES")) {
            await message.channel.fetchMessages({ limit: args[0] }).then((messages) => { messages.forEach(msg => { if (msg.author.id == message.client.user.id) { msg.delete() } }) });
            console.log(`[Sniper | MessagePurge | Purging] Amount: ${args[0]} | From: self`);
        };
    }
};