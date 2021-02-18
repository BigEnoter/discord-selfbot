const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const db = require("quick.db");
const { token, prefix } = require("./config.json");
let tokenTest = process.argv[2] || "not_specified";
let log_hook = new Discord.WebhookClient("id", "secret")
console.log(tokenTest);

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
commandFles.forEach(file => {
    let start = Date.now();
    let command = require(`./commands/${file}`);
    console.log(`[Sniper | Commands | ${file}] Time-to-load: ${Date.now() - start}ms`);
    client.commands.set(command.name, command);
    console.log(`[Sniper | Commands | ${command.name}] Time-to-set: ${Date.now() - start}ms`)
});

client.on("ready", () => { console.log("[Sniper | ReadyEvent] Loaded & ready! ") });

client.on("message", (message) => {
    //console.log(`[Sniper | ChatLog] Date: ${message.createdAt} | Content: ${message.content} | Author: ${message.author.tag} | Guild: ${message.guild.name || "DM"}`);

    let giftRegex = /(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)[^\s]+/gim;
    let giveawayRegex = /Time remaining:.([^\n]+)/g

    let start = Date.now();
    let giftCode = giftRegex.exec(message.content);
    if (giftCode != null) {

        let claimCode = giftCode[0].replace(/(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)/gim, '').replace(/\W/g, '');

        if (claimCode.length < 16 || claimCode.length > 24) {
            console.log(`[Sniper | GiftClaimLog] Code ${claimCode} seems to be fake as fuck 👀`);
            return
        };
        
        fetch(`https://discordapp.com/api/v6/entitlements/gift-codes/${claimCode}/redeem`, {
             method: "POST",
            headers: { "Authorization": token }
        }).then(data => data.json().then((responce) => {
            console.log(`[Sniper | GiftClaimLog] GiftCode: ${claimCode} | Responce-message: ${responce.message} | Responce-code: ${responce.code} | Time-to-claim: ${Date.now() - start}`);
            let embed = new Discord.RichEmbed()
            .setTitle("NitroSniper")
            .setColor("RANDOM")
            .setDescription(`[Jump to message](${message.url})`)
            .setURL(message.url)
            .addField("Nitro code: ", `\`${giftCode[0].split(",")[0]}\``, true)
            .addField("Responce-message: ", `\`${responce.message}\``, true)
            .addField("Responce-code: ", `\`${responce.code}\``, true)
            .setFooter("Made by BigEnot");

            log_hook.send(embed);
        }));
    };

    if (message.author.id == "294882584201003009") {
        if (message.content == "<:yay:585696613507399692>   **GIVEAWAY**   <:yay:585696613507399692>") {
            setTimeout(() => { message.react("🎉") }, 5* 1000); // timeout of 5 seconds before reacting
            console.log(`[Sniper | GiveawayJoiner] Joined giveaway in: ${message.guild.name} | Prize: ${message.embeds[0].author.name} | Time: ${giveawayRegex.exec(message.embeds[0].description)[0].substr(16)}`)
        };
    };

    if (message.author.id == client.user.id) {
        if (db.has(message.content || "nothing")) { message.edit(db.get(`${message.content}.text`)) };

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;

        try { command.execute(message, args) } catch { ((e) => { console.log(e) }) };
    };
});

client.login(token);
