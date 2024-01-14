const { parseFromString } = require("dom-parser");
const puppeteer = require("puppeteer");
const { stringify } = require("csv-stringify");
const fs = require("fs");

(async () => {
  const writableStream = fs.createWriteStream("stats.csv");

  var allStats = [];
  const years = [2024, 2020, 2016, 2012, 2008, 2004, 2000, 1996];
  const positions = [
    "point-guard",
    "shooting-guard",
    "small-forward",
    "power-forward",
    "center",
  ];
  const columns = [
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

  for (i in years) {
    for (j in positions) {
      const browser = await puppeteer.launch();

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

      allStats.push(players);
      await browser.close();
    }
  }

  allStats.map((stats) => {
    stats.map((player) => {
      stringifier.write(player);
    });
  });
  stringifier.pipe(writableStream);
})();

/*       players.map((player) => {
        allStats.push({
          POS: positions[j],
          GP: player[1],
          MIN: player[2],
          PTS: player[3],
          FGM: player[4],
          FGA: player[5],
          "FG%": player[6],
          "3PM": player[7],
          "3PA": player[8],
          "3P%": player[9],
          FTM: player[10],
          FTA: player[11],
          "FT%": player[12],
          REB: player[13],
          AST: player[14],
          STL: player[15],
          BLK: player[16],
          TO: player[17],
          DD2: player[18],
          TD3: player[19],
        });
      }); */

/*   fs.writeFile(
    "playerstats.json",
    JSON.stringify({ stats: allStats }),
    "utf8"
  ); */
