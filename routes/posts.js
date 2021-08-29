
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


// @route   Put api/posts/:id
// @desc    Update post by id
// @access  Private (등록된 유저만 수정 가능)

router.put('/:id', checkauth, (req, res) => {


})


// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private (등록된 유저만 삭제 가능)

router.delete('/:id', checkauth, (req, res) => {

    const postId = req.params.id

    // 삭제할 대상을 찾는다
    postModel
        .findById(postId)
        .then(post => {
            console.log("+++++++++++++", post.user)
            // 글쓴 사림인지 검증
            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({
                    message: "User not authorized"
                })
            } else {
                // // 포스트 삭제
                postModel
                    .findByIdAndRemove(postId)
                    .then(() => {
                        res.json({
                            message: 'delete post'
                        })
                    })
                    .catch(err => res.status(500).json(err))
            }
        })
            
})


// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private (로그인한 사람이면 누구든지 가능)

router.post('/like/:id', checkauth, (req, res) => {

    const postId = req.params.id;

    postModel
        .findById(postId)
        .then(post => {
            // 게시물에 좋아요를 했는지 여부 확인
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                // 좋아요를 했다면
                return res.status(400).json({
                    message: "User already liked this post"
                })
            } 

            // Add user id to likes array
            post.likes.unshift({user: req.user.id})
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(500).json(err))
})


// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private (로그인한 사람이면 누구든지 가능)
router.post('/unlike/:id', checkauth, (req, res) => {
    
    const postId = req.params.id;

    postModel
        .findById(postId)
        .then(post => {
            // 게시물에 좋아요를 했는지 여부 확인
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                return res.status(404).json({
                    message: "You have not liked this post"
                })
            }

            // get remove index
            const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

            // splice out of array
            post.likes.splice(removeIndex, 1);

            // save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(500).json(err))
})



module.exports = router