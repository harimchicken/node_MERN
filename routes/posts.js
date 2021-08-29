
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




// router.delete('/', checkauth, (req, res) => {

//     postModel
//         .findOneAndRemove({user: req.post.id})
//         .then(result => {
//             res.json({
//                 message: "deleted post"
//             })
//         })
//         .catch(err => res.status(500).json(err))
// })



module.exports = router