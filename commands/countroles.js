module.exports = {
    name: "count",
    execute(message, args) {
        message.edit("Starting...");
        
        let wholeMessage = args.join(" ");
        let flags = getFlagsWithValues(wholeMessage);

        if (!flags["guildID"]) { flags["guildID"] = message.guild.id };
        if (!flags["roleID"]) return message.edit("Specify a role which members should have to count them").then(msg => msg.delete(1500));

        let guild = message.client.guilds.get(flags["guildID"]);
        let counter = 0;

        if (guild) {
            message.edit("Found guild...").then(msg => {
                guild.fetchMembers().then(thing => {
                    msg.edit("Fetched users...").then(msgA => {
                        thing.members.forEach(member => {
                            if ( member.roles.find(role => role.id == flags["roleID"]) ) { counter += 1; };
                        });

                        msgA.edit(`Found \`${counter}\` members`);
                    });
                });
            });
        };
        /*let guild = message.client.guilds.get("604773552008462336");

        if (guild) {
            console.log("Found PX guild");
            let counter = 0;

	        guild.fetchMembers().then(thing => {
                thing.members.forEach(member => {
                    if ( member.roles.find(role => role.id == "605447798871162880") ) { counter += 1; console.log(counter) };
                });
            });
        };*/
    }
};

function parseFlags(text) {
    let regexp = /-\w+/g;

    return text.match(regexp)[0] || null;
};

function getFlagsWithValues(text) {
    let flagsObject = {};
    //regexp для поиска флагов со значениеям
    let longRegexp = /(-\w+).([\w\'\ \b]+)/g;
    //пихаем енто говно в массив
    let arrayOfMatches = text.match(longRegexp);
    //убираем лишние пробелы
    arrayOfMatches.forEach(match => match.trim());
    //достаем флаг + его значение :)
    arrayOfMatches.forEach(match => {
        let flag = parseFlags(match).replace("-", "");
        let value = match.replace(`-${flag}`, "").trim();

        flagsObject[flag] = value;
    });

    return flagsObject;
};