const app = require("./app")

const {PORT = 9092} = process.env

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}...`);
});//