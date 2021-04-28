// Require packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Connect to db
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Create schema
const articleSchema = new mongoose.Schema ({
    title: String,
    content: String
});

// Create model with schema
const Article = mongoose.model('Article', articleSchema);

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

///////////////////////////////////// REQUESTS FOR ALL ARTICLES /////////////////////////////////////

//Chainable route method
app.route("/articles")
.get( function(req, res) {

    // FETCH
    // Query database articles
    Article.find(function(err, results) {
        if (!err) {
            res.send(results);
        } else {
            res.send(err);
        }
    });

})

.post( function(req,res) {

    // CREATE
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    });

    // Save POST request
    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully saved new article.");
        } else {
            res.send(err);
        }
    });
    
})

.delete( function(req, res) {

    // DELETE documents
    Article.deleteMany(function(err) {
        if(!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });

});


///////////////////////////////////// REQUESTS FOR SPECIFIC ARTICLES /////////////////////////////////////

app.route("/articles/:articleTitle")

.get( function(req, res) {

    // FETCH single article
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        // Send article or error
        if (!err) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title.");
            }
        } else {
            res.send(err);
        }
    });

})

.put( function(req, res) {
    // PUT specific article 
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function (err) {
            if(!err) {
                res.send("Article updated successfully");
            } else {
                res.send(err);
            }
        }
    );

})

.patch( function (req, res) {
    // PATCH specfic article
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function (err) {
            if(!err) {
                res.send("Article updated successfully");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res) {

    // DELETE specific article
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if (!err) {
                res.send("Successfully deleted article");
            } else {
                res.send(err);
            }
        }
    );

});

// Listen to localhost post 3000
app.listen(3000, function() {
    console.log("Server started on port 3000");
});