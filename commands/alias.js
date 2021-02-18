const db = require("quick.db");
const hastebin = require("hastebin-gen");
const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");

// alias_name: { text: user_input } \\

module.exports = {
    name: "alias",
    execute(message, args) {
        let action = args[0];
        if (!action) return message.edit("❌ | valid action required!").then(edited => edited.delete(1000));

        switch(action) {
            case 'add':
                let alias_name = args[1];
                if (!alias_name) return message.edit("❌ | enter alias name!").then(edited => edited.delete(1000));

                let alias_text = args.slice(2).join(" ");
                if (!alias_text) return message.edit("❌ | enter some text please!").then(edited => edited.delete(1000));

                if (alias_text && alias_name) {
                    db.set(`${prefix}${alias_name}`, { text: alias_text });
                    message.edit("✅ | done!").then(edited => edited.delete(1000));
                };
            break;
            case 'remove':
                let alias = args[1];
                if (!alias) return message.edit("❌ | enter alias name!").then(edited => edited.delete(1000));

                if (db.has(alias)) {
                    db.delete(alias);
                    message.edit("✅ | done!").then(edited => edited.delete(1000));
                } else {
                    message.edit("❌ | invalid alias name!").then(edited => edited.delete(1000));
                }
            break;
            case 'edit':
                let aliasName = args[1];
                if (!aliasName) return message.edit("❌ | enter alias name!").then(edited => edited.delete(1000));

                if (db.has(aliasName)) {
                    let text = args.slice(2).join(" ");
                    if (!text) return message.edit("❌ | enter some text please!").then(edited => edited.delete(1000));

                    db.set(`${aliasName}.text`, text);
                    message.edit("✅ | done!").then(edited => edited.delete(1000));
                }  else {
                    message.edit("❌ | invalid alias name!").then(edited => edited.delete(1000));
                };
            break;
            case 'list':
                hastebin(JSON.stringify(db.all()), { extension: 'json' }).then(link => message.edit(link));
				let embed = new MessageEmbed()
				.setTitle("Hello world")
				
				message.channel.send(embed)
            break;
        };
    }
};