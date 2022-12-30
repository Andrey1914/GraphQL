const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("../schema/schema");
const mongoose = require("mongoose");

const app = express();
const PORT = 3005;

mongoose.connect(
  "mongodb+srv://Andrei:jw1914@cluster0.j4ipo8l.mongodb.net/db-graphql"
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error: ${err}`));
dbConnection.once("open", () => console.log("Connected To DB!"));

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log("Server started!");
});
