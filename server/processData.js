const fs = require("fs");
const axios = require("axios");
// const data = fs.readFileSync("./raw-data", { encoding: "utf8", flag: "r" });

// const questions = [];
// let answerChoices = [];
// let answerChoicesPerQuestion = [];

// data.split("\n").forEach((element) => {
//   if (
//     element[0] === "a" ||
//     element[0] === "b" ||
//     element[0] === "c" ||
//     element[0] === "d"
//   ) {
//     if (element[0] === "a") {
//       const cleanAnswer = answerChoicesPerQuestion.map((element) =>
//         element.slice(3, element.length)
//       );
//       answerChoices.push(cleanAnswer);
//       answerChoicesPerQuestion.length = 0;
//       answerChoicesPerQuestion.push(element);
//     } else {
//       answerChoicesPerQuestion.push(element);
//     }
//   } else {
//     questions.push(element.slice(element.indexOf(" ") + 1, element.length));
//   }
// });

// const output = [];

// for (let i = 0; i < questions.length - 1; i++) {
//   output.push({
//     question: questions[i],
//     incorrect_answers: answerChoices[i + 1],
//     answer: "abc",
//   });
// }

// const json = JSON.stringify({
//   chapter: 21,
//   data: output,
// });

// fs.writeFile("chap21.json", json, "utf8", (err) => {
//   console.log(output.length);
// });

// const numberOfChapters = 21;

// for (let chapter = 1; chapter <= numberOfChapters; chapter++) {
//   const data = fs.readFileSync("./data/chap" + chapter + ".json", {
//     encoding: "utf8",
//     flag: "r",
//   });
//   let chaptersData = JSON.parse(data);
//   let questions = chaptersData.data;
//   questions.forEach((e) => {
//     e.answer = 1;
//   });
//   fs.writeFileSync(
//     "./tmpData/chap" + chapter + ".json",
//     JSON.stringify({ chapter, data: questions })
//   );
// }

// const data = fs.readFileSync("./data/chap1.json", {
//   encoding: "utf8",
//   flag: "r",
// });

function getIndicesOf(searchStr, str, caseSensitive = 1) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  var startIndex = 0,
    index,
    indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

(async () => {
  const result = [];

  for (let page = 1; page <= 32; ++page) {
    await axios
      .get(
        "http://www.mcqtutorial.com/MCQ/Miscellaneous/Cloud%20Computing/121_198_" +
          page +
          ".php"
      )
      .then((res) => {
        const data = res.data;
        const openningTag =
          '<tr rowspan="100"><td colspan="100" align="left"><font size="4">';
        const closeTag =
          '<br /></font> </td></tr> <tr height="20"><td colspan="100"> </td></tr>';
        const start = getIndicesOf(openningTag, data);
        const end = getIndicesOf(closeTag, data);
        for (let i = 0; i < start.length; ++i) {
          let question = data.substring(start[i], end[i]);
          question = question.replaceAll(openningTag, "");
          question = question.replaceAll("<br />", " ");
          question = question.replaceAll("&nbsp;", " ");
          console.log(question);
          // result.push(question);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // console.log(result);
})();
