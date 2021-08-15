const router = require('express').Router();
const {User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');
router.get("/", withAuth, (req, res) => {
    try {
        userPostData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: ['id', 'title', 'content','created_at'],
            include: [
                {
                model: User,
                attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        });

        const userPosts = userPostData.get({plain: true});

        res.render("/dashboard", {
            ...userPosts,
            logged_in: true
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

router.get("/edit/:id", withAuth, (req, res) => {
    try {
        const userPostData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ["id", "comment_content", "post_id", "user_id", "create_at"],
                    include: {
                        model: User,
                        attributes: ["username"]
                    }
                }
            ]
        });

        if (!userPostData) {
            res.status(404).json({message: "Post does not exist."});
            return;
        }

        res.status(200).json(userPostData);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.get("/newpost", (req, res) => {
    res.render("newpost")
})


module.exports = router;