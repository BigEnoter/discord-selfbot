const { RichEmbed } = require("discord.js");
const random = require("random");

const images = {
    [1]: "https://cdn.discordapp.com/attachments/747571846383140934/792350842095271986/coin_heads.jpg",
    [2]: "https://cdn.discordapp.com/attachments/747571846383140934/792350854581190666/coin_tails.jpg"
}

module.exports = {
    name: "flip",
    execute(message, args) {
        const randReturn = random.int(1, 2);
        const embed = new RichEmbed()
        .setColor("RANDOM")
        .setTitle(randReturn == 1 ? `Heads!` : `Tails!`)
        .setImage(images[randReturn]);

        message.channel.send(embed).then(msg => msg.delete(5000));
    }
};