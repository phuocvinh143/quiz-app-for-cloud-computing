const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
let port = process.env.PORT || 3000;
const numberOfChapters = 21;

app.use(cors());

app.get("/", (req, res) => {
  res.send("This is the question API!");
});

app.get("/questions", (req, res) => {
  const ratio = req.query.ratio;
  let result = [];
  for (let chapter = 1; chapter <= numberOfChapters; chapter++) {
    const data = fs.readFileSync("./data/chap" + chapter + ".json", {
      encoding: "utf8",
      flag: "r",
    });

    const questions = JSON.parse(data).data;

    const shuffled = questions
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    result = result.concat(
      shuffled.slice(0, parseFloat(ratio) * questions.length)
    );
  }

  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
