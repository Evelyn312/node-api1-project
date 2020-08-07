const express = require("express");

const db = require("./database");
const { request } = require("express");

const port = 5000;

const server = express();

server.use(express.json());


server.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
server.get("/", (req, res) => {
    res.send("Hello Word from Express!");
});

server.get("/users", (req, res) => {
    const users = db.getUsers();
    if(users){
        res.status(200).send(users);
    } else {
        res.status(500).json({
            errorMessage: "The users information could not be retrieved."
        });
    }
});

server.get("/users/:id", (req, res) => {
    const id = req.params.id;
    const user = db.getUserById(id);
    if(user){
        res.json(user);
    } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
});

server.post("/users", (req, res) => {
    if(!req.body.name || !req.body.bio ){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user."});
    } else {
        const newUser = db.createUser({
            name: req.body.name,
            bio: req.body.bio
     
         });
         if(newUser){
            res.status(201).json(newUser);
         } else{
             res.status(500).json({errorMessage: "There was an error while saving the user to the database"});
         }
    
    }
});

server.put("/users/:id", (req,res) => {
    const user = db.getUserById(req.params.id);
    if(user){
        if(!req.body.name || !req.body.bio){
            res.status(400).json({
                errorMessage: "Please provide name and bio for the user."
            })
        } else {
            db.updateUser(req.params.id,
                {name: req.body.name, bio: req.body.bio})
            res.json(res.body);
        }
        
    }else{
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        });
    }
});

server.delete("/users/:id", (req, res) => {
    const user = db.getUserById(req.params.id);
    if(user){
        db.deleteUser(req.params.id);
        res.status(204).end();
    } else {
        res.status(404).json({ 
            message: "The user with the specified ID does not exist." });
    }
})