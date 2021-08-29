
const express = require('express');
const router = express.Router()
const passport = require('passport');

const checkauth = passport.authenticate('jwt', { session: false});

const postModel = require('../models/post');


// @route   GET api/posts/total
// @desc    get posts
// @access  Pubilc

router.get('/total', (req, res) => {
    postModel
        .find()
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json(err))
})


// @route   GET api/posts/:id
// @desc    get detail post
// @access  Private

router.get('/:id', checkauth, (req, res) => {
    const postId = req.params.id;

    postModel
        .findById(postId)
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    message: "no post number " + postId
                })
            } else {
                res.json(post);
            }
            
        })
        .catch(err => res.status(500).json(err))

})

// @route   POST api/posts
// @desc    Create post
// @access  Private

router.post('/', checkauth, (req, res) => {

    const { text, name } = req.body;

    const newPost = new postModel({
        text, name, user: req.user.id
    })

    newPost
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(500).json(err))
})



module.exports = router