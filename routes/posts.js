
const express = require('express');
const router = express.Router()
const passport = require('passport');
const postModel = require('../models/post');

const checkauth = passport.authenticate('jwt', { session: false});

const {
    posts_get_total,
    posts_get_detail,
    posts_post_post,
    posts_delete_post,
    posts_like_post,
    posts_unlike_post
} = require('../controllers/post');

// @route   GET api/posts/total
// @desc    get posts
// @access  Pubilc

router.get('/total', posts_get_total)


// @route   GET api/posts/:id
// @desc    get detail post
// @access  Private

router.get('/:id', checkauth, posts_get_detail)

// @route   POST api/posts
// @desc    Create post
// @access  Private

router.post('/', checkauth, posts_post_post)


// @route   Put api/posts/:id
// @desc    Update post by id
// @access  Private (등록된 유저만 수정 가능)

router.put('/:id', checkauth, (req, res) => {

    const { text, name } = req.body;

    const newPost = new postModel({
        text, name, user: req.user.id
    })

    newPost
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(500).json(err))
})


// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private (등록된 유저만 삭제 가능)

router.delete('/:id', checkauth, posts_delete_post)


// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private (로그인한 사람이면 누구든지 가능)

router.post('/like/:id', checkauth, posts_like_post)


// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private (로그인한 사람이면 누구든지 가능)
router.post('/unlike/:id', checkauth, posts_unlike_post)

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', checkauth, (req, res) => {
    const postId = req.params.id;
    const {name, text} = req.body;

    postModel
        .findById(postId)
        .then(post => {
            if (!post) {
                return res.status(400).json({
                    message: "no post by id"
                })
            } else {
                const newComment = {
                    text,
                    name,
                    user: req.user.id
                }
                post.comment.unshift(newComment)
                post.save().then(post => res.json(post))
            }
        })
        .catch(err => res.status(500).json(err))


    // const postId = req.params.id;

    // postModel
    //     .findbyId(postId)
    //     .then(post => {
    //         res.json(post)
    //     })

    //     post.comment.unshift({user: req.user.id})
    //     this.post.save()
    //     .catch()

})

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private

router.delete('/comment/:postId/:commentId', checkauth, (req, res) => {
    postModel
        .findById(req.params.postId)
        .then(post => {
            if(post.comment.filter(comment => comment._id.toString() === req.params.commentId).length === 0) {
                return res.status(400).json({ msg: 'Comment does not exist' });
            }
            //삭제(배열)
            const removeIndex = post.comment
                .map(item => item._id.toString()) //_id를 toString으로 바꿔줌
                .indexOf(req.params.commentId)
                //잘라내기
            post.comment.splice(removeIndex, 1);
            post
                .save()
                .then(post => {
                    res.json(post)
                });
        });
});



// router.delete('/comment/:postId/:commentId', checkauth, (req, res) => {
   
//     console.log(req.params.postId)
//     console.log(req.params.commentId)


//     postModel
//         .findById(req.params.postId)
//         .then(post => {
//             // console.log("++++++++++++++++", post)
//             // if (post.comment.filter(c => c.user.toString() === req.user.id).length === 0 ) {
//             //     return res.status(404).json({
//             //         message: "Comment does't exist"
//             //     })
//             // } else {
//                 // get remove index
//             const removeIndex = post.comment
//             .map(item => item._id.toString())
//             .indexOf(commentid)

//         console.log(removeIndex)
        
//         // splice comment out of array
//         post.comment.splice(removeIndex, 1);
//         post.save().then(post => res.json(post));
//             // }

            
//         })
//         .catch(err => res.status(500).json(err))





module.exports = router