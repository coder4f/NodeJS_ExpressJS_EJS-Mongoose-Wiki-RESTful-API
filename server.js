const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articlesSchema);

app.route("/articles")

.get(function(req, res) {
    Article.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res) {
    Article.deleteOne({ title: 'Jack Bauer' }, function(err) {
        if (!err) {
            res.send("Successfully deleted item from collection.");
        } else {
            res.send(err);
        }
    });
});


////////////////////Request Targeting a Specific Article////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, docs) {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    });
})

.put(function(req, res) {
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err) {
            if(!err) {
                res.send("Successfully updated article.");
            }
        }
    );
})

.patch(function (req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if(!err) {
                res.send("Successfully updated article.");
            }
        }
    );
})

.delete(function (req, res) {
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if(!err) {
            res.send("Successfully deleted an article");
        }
    });
});

app.listen(3000, function() {
    console.log("Server has started on port 3000.");
});