import { CommandBuilder } from "@enitoni/gears-discordjs";

import { ParseArgumentsState } from "../../common/parsing/middleware/parseArguments";
import { matchPrefixesStrict } from "../../common/matching/matchPrefixesStrict";

import jimp from "jimp";

async function manipulateImage(text: string) {
    const image = await jimp.read("src/common/images/anyway.jpg");
    const font = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
    image.print(font, 600, 625, text);

    image.write("src/common/images/anywayManipulated.jpg");
}

export default new CommandBuilder()
    .match(matchPrefixesStrict("anyway"))
    .use<ParseArgumentsState>(async context => {
        const { message } = context;
        const { args } = context.state;
    
        message.delete();

        if (!args.length) {
            return message.channel.send(
                `Please enter some text: \`cc!anyway [text]\``
            );
        }

        if (args.join(" ").length < 20) {
            await manipulateImage(args.join(" "));
            return message.channel.send("", {
                file: `src/common/images/anywayManipulated.jpg`
            });
        } else {
            return message.channel.send(`**ERROR:** Input text is too long.`);
        }
    })
    .done();
