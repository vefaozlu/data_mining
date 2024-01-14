const { parseFromString } = require("dom-parser");
const puppeteer = require("puppeteer");
const { stringify } = require("csv-stringify");
const fs = require("fs").promises;

const data = {
  i: [
    { name: "Marc Iavaroni", height: "203" },
    { name: "Serge Ibaka", height: "211" },
    { name: "Andre Iguodala", height: "198" },
    { name: "Zydrunas Ilgauskas", height: "221" },
    { name: "Mile Ilić", height: "216" },
    { name: "D.J. Mbenga", height: "213" },
    { name: "Ersan İlyasova", height: "206" },
    { name: "Darrall Imhoff", height: "208" },
    { name: "Tom Ingelsby", height: "191" },
    { name: "Joe Ingles", height: "206" },
    { name: "Damien Inglis", height: "203" },
    { name: "Andre Ingram", height: "191" },
    { name: "Brandon Ingram", height: "203" },
    { name: "McCoy Ingram", height: "203" },
    { name: "Ervin Inniger", height: "193" },
    { name: "Byron Irvin", height: "196" },
    { name: "George Irvine", height: "198" },
    { name: "Kyrie Irving", height: "188" },
    { name: "Jonathan Isaac", height: "208" },
    { name: "Dan Issel", height: "206" },
    { name: "Mike Iuzzolino", height: "178" },
    { name: "Allen Iverson", height: "183" },
    { name: "Willie Iverson", height: "183" },
    { name: "Jaden Ivey", height: "193" },
    { name: "Royal Ivey", height: "191" },
    { name: "Elvin Ivory", height: "203" },
    { name: "Wes Iwundu", height: "198" },
  ],
  j: [
    { name: "Warren Jabali", height: "188" },
    { name: "Jarrett Jack", height: "191" },
    { name: "Aaron Jackson", height: "193" },
    { name: "Al Jackson", height: "185" },
    { name: "Andre Jackson Jr.", height: "198" },
    { name: "Bobby Jackson", height: "185" },
    { name: "Cedric Jackson", height: "191" },
    { name: "Darnell Jackson", height: "206" },
    { name: "Demetrius Jackson", height: "185" },
    { name: "Frank Jackson", height: "191" },
    { name: "Greg Jackson", height: "183" },
    { name: "Gregory Jackson II", height: "206" },
    { name: "Isaiah Jackson", height: "208" },
    { name: "Jaren Jackson", height: "193" },
    { name: "Jaren Jackson Jr.", height: "208" },
    { name: "Jermaine Jackson", height: "193" },
    { name: "Jim Jackson", height: "198" },
    { name: "Josh Jackson", height: "203" },
    { name: "Justin Jackson", height: "203" },
    { name: "Luke Jackson", height: "206" },
    { height: "NaN" },
    { name: "Luke Jackson", height: "201" },
    { name: "Marc Jackson", height: "208" },
    { name: "Mark Jackson", height: "185" },
    { name: "Merv Jackson", height: "191" },
    { name: "Michael Jackson", height: "188" },
    { name: "Mike Jackson", height: "201" },
    { name: "Myron Jackson", height: "191" },
    { name: "Phil Jackson", height: "203" },
    { name: "Pierre Jackson", height: "178" },
    { name: "Quenton Jackson", height: "196" },
    { name: "Ralph Jackson", height: "188" },
    { name: "Randell Jackson", height: "211" },
    { name: "Reggie Jackson", height: "188" },
    { name: "Stanley Jackson", height: "191" },
    { name: "Stephen Jackson", height: "203" },
    { name: "Tony Jackson", height: "193" },
    { name: "Tony Jackson", height: "183" },
    { name: "Tracy Jackson", height: "198" },
    { name: "Wardell Jackson", height: "201" },
    { name: "Trayce Jackson-Davis", height: "206" },
    { height: "NaN" },
    { name: "Fred Jacobs", height: "191" },
    { name: "Casey Jacobsen", height: "198" },
    { name: "Sam Jacobson", height: "193" },
    { name: "Dave Jamerson", height: "196" },
    { name: "Aaron James", height: "203" },
    { name: "Bernard James", height: "208" },
    { name: "Billy James", height: "191" },
    { name: "Damion James", height: "201" },
    { name: "Gene James", height: "193" },
    { name: "Henry James", height: "203" },
    { name: "Jerome James", height: "213" },
    { name: "Justin James", height: "201" },
    { name: "LeBron James", height: "206" },
    { name: "Mike James", height: "188" },
    { name: "Mike James", height: "185" },
    { name: "Tim James", height: "201" },
    { name: "Antawn Jamison", height: "206" },
    { name: "Harold Jamison", height: "203" },
    { name: "John Janisch", height: "191" },
    { name: "Howie Janotta", height: "191" },
    { height: "NaN" },
    { name: "Jaime Jaquez Jr.", height: "198" },
    { name: "Marko Jarić", height: "201" },
    { name: "Tony Jaros", height: "191" },
    { name: "DeJon Jarreau", height: "196" },
    { name: "Jim Jarvis", height: "185" },
    { name: "Šarūnas Jasikevičius", height: "193" },
    { name: "Nathan Jawai", height: "208" },
    { name: "Buddy Jeannette", height: "180" },
    { name: "Abdul Jeelani", height: "203" },
    { name: "Chris Jefferies", height: "203" },
    { name: "Othyus Jeffers", height: "196" },
    { name: "Al Jefferson", height: "208" },
    { name: "Amile Jefferson", height: "206" },
    { name: "Cory Jefferson", height: "206" },
    { name: "Dontell Jefferson", height: "196" },
    { name: "Richard Jefferson", height: "201" },
    { name: "DaQuan Jeffries", height: "196" },
    { name: "Jared Jeffries", height: "211" },
    { name: "Charles Jenkins", height: "191" },
    { name: "Horace Jenkins", height: "185" },
    { height: "NaN" },
    { name: "John Jenkins", height: "193" },
    { name: "Brandon Jennings", height: "185" },
    { name: "Keith Jennings", height: "170" },
    { name: "Chris Jent", height: "201" },
    { name: "Les Jepsen", height: "213" },
    { name: "Jonas Jerebko", height: "208" },
    { name: "Ty Jerome", height: "196" },
    { name: "Grant Jerrett", height: "208" },
    { name: "Eugene Jeter", height: "180" },
    { name: "Hal Jeter", height: "191" },
    { name: "Yi Jianlian", height: "213" },
    { name: "Isaiah Joe", height: "193" },
    { name: "Britton Johnsen", height: "208" },
    { name: "Alexander Johnson", height: "206" },
    { name: "Alize Johnson", height: "201" },
    { name: "Amir Johnson", height: "206" },
  ],
};

(async () => {
  
})();
