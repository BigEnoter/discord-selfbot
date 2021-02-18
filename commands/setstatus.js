module.exports = {
    name: "setstatus",
    execute (message, args) {
        let wholeThing = args.join(" ");
        let detectedFlag = parseFlags(wholeThing);

        wholeThing.replace(detectedFlag, "");
        detectedFlag.replace("-", "");

        message.client.user.setActivity(wholeThing, {type: detectedFlag});
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