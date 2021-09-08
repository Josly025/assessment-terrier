const express = require("express");
const router = express.Router();

//use later with EJS?
// const myCss = {
//   style: fs.readFileSync("./public/css/style.css", "utf8"),
// };

// at "/ " render the welcome view
router.get("/", (req, res) => {
  res.render("welcome"),
    {
      myCss: myCss,
    };
});

module.exports = router;
