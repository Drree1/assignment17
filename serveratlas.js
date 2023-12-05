const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://Drree1:GrahamD754@cluster0.p1emo0k.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.log("Couldn't connect to mongodb", error));

const teamSchema = new mongoose.Schema({
  name: String,
  owner: String,
  legends: [String],
});

const Team = mongoose.model("Team", teamSchema);

const createTeam = async () => {
  const team = new Team({
    name: "New England Patriots",
    owner: "Robert Kraft",
    legends: ["Tom Brady", "Rob Gronkowski", "Julian Edelman"],
  });

  const result = await team.save();
  console.log(result);
};

createTeam();