const Discord = require("discord.js");
const fetch = require("node-fetch");
const { token } = require("./config.json");

const client = new Discord.Client();

client.on("ready", () => { console.log("[Sniper | ReadyEvent] Loaded & ready! ") });

client.on("message", (message) => {
    //console.log(`[Sniper | ChatLog] Date: ${message.createdAt} | Content: ${message.content} | Author: ${message.author.tag} | Guild: ${message.guild.name || "DM"}`);

    let giftRegex = /discord.gift.{17}|discord.com.gifts.{17}/g;
    let giveawayRegex = /Time remaining:.([^\n]+)/g

    let start = Date.now();
    let giftCode = giftRegex.exec(message.content);
    if (giftCode != null) {
        
        fetch(`https://discordapp.com/api/v6/entitlements/gift-codes/${sub(giftCode[0].substr(13))}/redeem`, {
             method: "POST",
            headers: { "Authorization": token }
        }).then(data => data.json().then((responce) => {
            console.log(`[Sniper | GiftClaimLog] GiftCode: ${giftCode} | Responce-message: ${responce.message} | Responce-code: ${responce.code} | Time-to-claim: ${Date.now() - start}`);
        }));
    };

    if (message.author.id == "294882584201003009") {
        if (message.content == "<:yay:585696613507399692>   **GIVEAWAY**   <:yay:585696613507399692>") {
            message.react("🎉");
            console.log(`[Sniper | GiveawayJoiner] Joined giveaway in: ${message.guild.name} | Prize: ${message.embeds[0].author.name} | Time: ${giveawayRegex.exec(message.embeds[0].description)[0].substr(16)}`)
        };
    };
});

client.login(token);

let sub = function(text) {
    if (text.length == 21) {
        return text.substr(5);
    } else {
        return text;
    }
};