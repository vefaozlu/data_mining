const { parseFromString } = require("dom-parser");
const puppeteer = require("puppeteer");
const { stringify } = require("csv-stringify");
const fs = require("fs");
const fsPromises = require("fs").promises;

(async () => {
  const heightsJSON = await fsPromises.readFile("playerheights.json", "utf8");
  const heights = JSON.parse(heightsJSON);

  const writableStream = fs.createWriteStream("stats1.csv");

  var allStats = [];
  const years = [
    2024, 2022, 2020, 2018, 2016, 2014, 2012, 2010, 2008, 2006, 2004, 2002,
    2000, 1998, 1996,
  ];
  const positions = [
    "point-guard",
    "shooting-guard",
    "small-forward",
    "power-forward",
    "center",
  ];
  const columns = [
    "HT",
    "POS",
    "GP",
    "MIN",
    "PTS",
    "FGM",
    "FGA",
    "FG%",
    "3PM",
    "3PA",
    "3P%",
    "FTM",
    "FTA",
    "FT",
    "REB",
    "AST",
    "STL",
    "BLK",
    "TO",
    "DD2",
    "TD3",
  ];

  const stringifier = stringify({ header: true, columns: columns });
  const browser = await puppeteer.launch();

  for (i in years) {
    for (j in positions) {
      console.log(`Year: ${years[i]} Position: ${positions[j]}`);

      const page = await browser.newPage();

      await page.goto(
        `https://www.espn.com/nba/stats/player/_/season/${years[i]}/seasontype/2/position/${positions[j]}`,
        {
          waitUntil: "networkidle0",
        }
      );

      const tables = await page.evaluate(() =>
        Array.from(document.querySelectorAll("table tbody")).map(
          (values) => values.innerHTML
        )
      );

      const parsed1 = parseFromString(tables[0], "text/html");

      var playerHeights = [];

      parsed1.getElementsByTagName("tr").forEach((element) => {
        const name =
          element.childNodes[1].childNodes[0].childNodes[1].innerHTML;

        var parts = name.split(" ");
        var surname = parts[parts.length - 1];
        var firstLetter = surname.charAt(0);

        try {
          const found = heights[firstLetter.toLocaleLowerCase()].find(
            (p) => p.name === name
          );

          playerHeights.push(found === undefined ? null : found.height);
        } catch (err) {
          playerHeights.push(null);
        }
      });

      const parsed = parseFromString(tables[1], "text/html");

      var players = [];

      parsed.getElementsByTagName("tr").forEach((element) => {
        var player = [];
        element.getElementsByTagName("td").forEach((e) => {
          player.push(e.innerHTML);
        });
        player[0] = positions[j];
        players.push(player);
      });

      players.map((player, index) => {
        player.unshift(playerHeights[index]);
      });

      console.log(players);
      allStats.push(players);
    }
  }
  await browser.close();

  allStats.map((stats) => {
    stats.map((player) => {
      stringifier.write(player);
    });
  });
  stringifier.pipe(writableStream);
})();
