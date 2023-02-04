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


app.get('/articles', (req, res) => {
    Article.find((err, foundArticle) => {
        if (!err) {

            res.send(foundArticle)
        }
        else {
            res.send(err);
        }
    })
})

app.post('/articles', (req, res) => {
    // let title = req.body.title;
    // let content = req.body.content;
    // res.send(title)
    // res.send(content);

    var article1 = new Article({ title: req.body.title, content: req.body.content });

    article1.save((err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send("succesfully added the document")
        }
    })
})

app.delete('/articles', (req, res) => {
    Article.deleteMany({}, (err) => {
        if (!err) {
            console.log("deleted succesfully");
            res.send("deleted succcesfully")

        }
        console.log(err);
    })
})
app.listen(3000, () => {
    console.log("server started on port 3000")
})