const postModel = require('../models/post');

exports.posts_get_total = (req, res) => {
    postModel
        .find()
        .then(posts => res.json(posts))
        .catch(err => res.status(500).json(err))
}

exports.posts_get_detail = (req, res) => {
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

}

exports.posts_post_post = (req, res) => {

    const { text, name } = req.body;

    const newPost = new postModel({
        text, name, user: req.user.id
    })

    newPost
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(500).json(err))
}

exports.posts_update_post =


exports.posts_delete_post = (req, res) => {

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
            
}

exports.posts_like_post = (req, res) => {

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
}

exports.posts_unlike_post = (req, res) => {
    
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
}