//jshint esversion:6

const express = require("express")

const bodyParser = require('body-parser')


const ejs = require('ejs')
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.send("hello")
})

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route('/articles').get((req, res) => {
    Article.find((err, foundArticle) => {
        if (!err) {

            res.send(foundArticle)
        }
        else {
            res.send(err);
        }
    })
}).post((req, res) => {


    var article1 = new Article({ title: req.body.title, content: req.body.content });

    article1.save((err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send("succesfully added the document")
        }
    })
}).delete((req, res) => {
    Article.deleteMany({}, (err) => {
        if (!err) {
            console.log("deleted succesfully");
            res.send("deleted succcesfully")

        }
        console.log(err);
    })
});



app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            }
            else {
                res.send("no article found")
            }
        });
    })
    .put(function (req, res) {

        const articleTitle = req.params.articleTitle;

        Article.updateOne(
            { title: articleTitle },
            { content: req.body.newContent },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfully updated the content of the selected article.");
                } else {
                    res.send(err);
                }
            });
    })
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send("succesfully updated")
                }
                else {
                    res.send(err)
                }
            }
        )
    })
    .delete((req, res) => {
        Article.deleteOne(
            { title: req.params.articleTitle },
            (err) => {
                if (!err) {
                    res.send("succesfully deleted")
                }
                else {
                    res.send(err)
                }
            }
        )
    })



app.listen(3000, () => {
    console.log("server started on port 3000")
})