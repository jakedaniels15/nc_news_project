const app = require("./app")

const {PORT = 9092} = process.env

if (process.env.NODE_ENV === "production") {
  require("./db/seeds/run-seed")();
}

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}...`);
});//