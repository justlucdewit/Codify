import { CommandBuilder } from "@enitoni/gears-discordjs";
import { matchPrefixesStrict } from "../../common/matching/matchPrefixesStrict";

import puppeteer from "puppeteer";

export default new CommandBuilder()
    .match(matchPrefixesStrict("challenge"))
    .use(async context => {
        try {
            const browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"]
            });
            const page = await browser.newPage();

            await page.goto("https://seblague.github.io/ideagenerator/");
            await page.click(".button");

            const element = await page.$("#content");
            const text = await page.evaluate(
                element => element.textContent,
                element
            );

            return context.message.channel.send(
                `**You have to make:** ${text}`
            );
        } catch (e) {
            console.info(e);
            return context.message.channel.send(`
            **ERROR:** Could not load source page.
            `);
        }
    })
    .done();
