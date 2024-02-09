const puppeteer = require("puppeteer");
const fs = require("fs").promises;

(async () => {
  var allPlayers = {};
  //  letters = "abcdefghijklmnopqrstuvwyz".split("");
  letters = "klmnopqrstuvwyz".split("");

  const browser = await puppeteer.launch();

  for (i in letters) {
    try {
      const page = await browser.newPage();

      console.log("");

      await page.goto(
        `https://www.basketball-reference.com/players/${letters[i]}/`,
        {
          waitUntil: "networkidle0",
        }
      );

      console.log("page loaded");

      const players = await page.evaluate(() =>
        Array.from(document.querySelectorAll("table tbody > tr")).map((a) => {
          const height = a.childNodes[4].innerText;
          let feet = String(height).slice(0, 1);
          let inch = String(height).slice(1 + 1);
          let cm = (parseInt(feet) * 30.48 + parseInt(inch) * 2.54).toFixed(0);

          return {
            name: a.childNodes[0].childNodes[0]
              ? a.childNodes[0].childNodes[0].innerText
              : a.childNodes[0].innerText,
            height: cm,
          };
        })
      );

      allPlayers[letters[i]] = players;

      console.log(i);
    } catch (e) {
      console.log(e);
      break;
    }
  }

  await browser.close();
  console.log(allPlayers);
  await fs.writeFile("playerheights3.json", JSON.stringify(allPlayers), "utf8");

  return;
})();
