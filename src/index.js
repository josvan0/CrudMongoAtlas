'use strict'

// ********** modules **********

require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// ********** consts **********

const PORT = process.env.PORT || 9000;
const app = express();

// ********** database **********

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Anonymous' },
    publishDate: { type: Date, default: new Date() }
});
const Post = mongoose.model('Post', postSchema);

// ********** middlewares **********

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.path} ${req.ip}`);
    next();
});

// ********** routes **********

app.get('/', (req, res) => {
    res.redirect('/manager');
});

app.get('/manager', (req, res) => {
    res.render('pages/manager');
});

app.get('/post/:postId?', (req, res) => {
    res.render('pages/post', { postId: req.params.postId });
});

app.route('/api/posts/:postId?')
    .get((req, res) => {
        if (req.params.postId) {
            Post.findById({ _id: req.params.postId }, (err, data) => {
                if (err) {
                    return res.json({ error: err });
                }
                res.json(data);
            });
        } else {
            Post.find({}, (err, data) => {
                if (err) {
                    return res.json({ error: err });
                }
                res.json(data);
            });
        }
    })
    .post((req, res) => {
        let { postId, title, content, author, publishDate } = req.body;
        let post = {
            title: title,
            content: content
        };
        if (author) {
            post['author'] = author;
        }
        if (publishDate) {
            post['publishDate'] = publishDate;
        }

        if (postId) {
            Post.findByIdAndUpdate(postId, post, (err) => {
                if (err) {
                    return res.json({ error: err });
                }
                res.json({ message: 'Post updated successfully' });
            });
        } else {
            Post.create(post, (err, data) => {
                if (err) {
                    return res.json({ error: err });
                }
                res.json(data);
            });
        }
    })
    .delete((req, res) => {
        Post.deleteOne({ _id: req.params.postId }, (err) => {
            if (err) {
                return res.json({ error: err });
            }
            res.json({ message: 'Post deleted successfully' });
        });
    });

// ********** server **********

app.listen(PORT, () => {
    console.log(`Listen on http://localhost:${PORT}`);
});
