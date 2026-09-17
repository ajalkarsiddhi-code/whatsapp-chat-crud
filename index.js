const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Chat = require("./models/chat");

app.use(methodOverride("_method"));

main()
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Public Folder
app.use(express.static(path.join(__dirname, "public")));
//for read the user data that come through post request 
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

// SHOW ALL CHATS
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    console.log(chats);
    res.render("index", { chats });
});


// FORM PAGE
app.get("/chats/new", (req, res) => {
    res.render("new");
});


// CREATE CHAT
app.post("/chats", async (req, res) => {
    let { from, to, msg } = req.body;

    let newChat = new Chat({
        from,
        to,
        msg,
        created_at: new Date(),
    });

    await newChat.save();

    res.redirect("/chats");
});
// Create Edit Route
app.get("/chats/:id/edit", async (req, res) => {

    let { id } = req.params;

    let chat = await Chat.findById(id);

    res.render("edit", { chat });

});
// Update Route (PATCH)

app.patch("/chats/:id", async (req, res) => {

    let { id } = req.params;
    let { msg } = req.body;

    await Chat.findByIdAndUpdate(id, {
        msg: msg
    });

    res.redirect("/chats");

});
// Delete Route
app.delete("/chats/:id", async (req, res) => {

    let { id } = req.params;

    await Chat.findByIdAndDelete(id);

    res.redirect("/chats");

});
app.listen(8080, () => {
  console.log("Server Started");
});