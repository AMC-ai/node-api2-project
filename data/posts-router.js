const express = require('express');

const db = require('./db');

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
    db.find()
        .then(post => {
            res
                .status(200)
                .json(post);
        })
        .catch(error => {
            console.log('error on GET /posts', error);
            res
                .status(500)
                .json({ errorMessage: 'The posts information could not be retrieved.' });
        });

});

router.post('/', (req, res) => {
    const postData = req.body;
    const { title, contents } = postData
    if (!title || !contents) {
        res
            .status(400)
            .json({ errorMessage: 'Please provide title and contents for the post.' })
    } else {
        db.insert(postData)
            .then(post => {
                res
                    .status(201)
                    .json(post);
            })
            .catch(error => {
                console.log('error on POST /posts', error);
                res
                    .status(500)
                    .json({ error: 'There was an error while saving the post to the database.' })
            });
    };
});

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res
                    .status(404)
                    .json({ message: 'The post with the specified ID does not exist.' });
            }
        })
        .catch(error => {
            console.log('error on GET /posts/:id', error);
            res
                .status(500)
                .json({
                    message: 'The post information could not be retrieved.',
                });
        });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            if (!post) {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            } else {
                db.remove(id)
                    .then(post => {
                        res
                            .status(201)
                            .json(post)
                    })
                    .catch(error => {
                        console.log('error on DELETE /posts/:id', error);
                        res
                            .status(500)
                            .json({ error: "The post could not be removed." });
                    });
            };
        });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const modify = req.body

    db.findById(id)
        .then(post => {
            if (!post) {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            } else if (!modify.title || !modify.contents) {
                res
                    .status(400)
                    .json({ errorMessage: "Please provide title and contents for the post." })
            } else {
                db.update(id, modify)
                    .then(post => {
                        res
                            .status(200)
                            .json(post)
                    })
                    .catch(error => {
                        console.log('error on PUT /posts/:id', error);
                        res
                            .status(500)
                            .json({ error: "The post information could not be modified." });
                    });
            }
        });
});


router.get('/:id/comments', (req, res) => {
    db.findCommentById(req.params.id)
        .then(comment => {
            if (comment) {
                res.status(200).json(comment);
            } else {
                res
                    .status(404)
                    .json({ message: 'The comment with the specified ID does not exist.' });
            }
        })
        .catch(error => {
            console.log('error on GET /:id/comments', error);
            res
                .status(500)
                .json({
                    message: 'The comments information could not be retrieved.',
                });
        });
});



router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const commentData = req.body;
    const { text } = commentData
    console.log('post id', id);

    //called the wrong function 'findPostComments'
    db.findCommentById(id)
        .then(post => {
            console.log('post', post)
            console.log('comment test', text)
            if (!post) {
                res
                    .status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            } else if (!text) {
                res
                    .status(400)
                    .json({ errorMessage: "Please provide text for the comment." })
            } else {
                console.log('comment body', commentData)
                //had the wrong peramiters for the argument via the wrong function
                db.insertComment(commentData)
                    .then(comment => {
                        res
                            .status(200)
                            .json(comment)
                    })
                    .catch(error => {
                        console.log('error on POST /:id/comments', error);
                        res
                            .status(500)
                            .json({ error: "There was an error while saving the comment to the database" });
                    });
            }
        });
});


module.exports = router;