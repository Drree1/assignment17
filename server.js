const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose.connect("mongodb+srv://Drree1:GrahamD754@cluster0.p1emo0k.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{console.log("Connected to Mongo")})
.catch((error)=>console.log("Couldn't connect to Mongo", error));

const teamSchema = new mongoose.Schema({
    name:String,
    owner:String,
    legends:[String],
    img:String,
});

const Team = mongoose.model("Team", teamSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


app.get("/api/teams", (req, res) => {
    getTeams(res);
});

const getTeams = async (res) => {
    const teams = await Team.find();
    res.send(teams)
};

app.get("/api/teams/:id", (req, res) => {
    getTeam(res, req.params,id);
});

const getTeam = async (res, id) => {
    const team = await Team.FindOne({_id:id})
    res.send(team);
};

app.post("/api/teams", upload.single("img"), (req, res) => {
    const result = validateTeam(req.body);
    console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const team = new Team({
        name:req.body.name,
        owner:req.body.owner,
        legends:req.body.legends.split(",")
    });

    createTeam(res, team);
});

const createTeam = async (res, team) => {
    const result = await team.save();
    res.send(team);
};

app.put("/api/teams/:id", upload.single("img"), (req, res) => {
   
    const result = validateTeam(req.body);
    console.log(result);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateTeam(req, res);
});

const updateTeam = async (req, res) => {
    let fieldsToUpdate = {
        name:req.body.name,
        owner:req.body.owner,
        legends:req.body.legends.split(",")
    }

    if(req.file){
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const result = await Team.updateOne({_id:req.params.id}, fieldsToUpdate);
    res.send(result);
};

app.delete("/api/teams/:id", upload.single("img"), (req, res) => {
   
    removeTeams(res, req.params.id);
});

const removeTeams = async (res, id) => {
    const team = await Team.findByIdAndDelete(id);
    res.send(team);
};

const validateTeam = (team) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        ingredients: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required()
    });

    return schema.validate(team);
};

app.listen(3000, () => {
    console.log("I'm listening");
});