const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get("/:id", async (req, res) => {
    try{
        const userData = await User.findByPk(req.session.user_id, {
            attribute: { exclude: ["password"]},
            include: [{
                model: Post,
                attributes: ["id", "title", "post_content"]
                },
            {
                model: Comment,
                attribute: ["id", "comment_content", "created_at"]
            }]
        });
    
        if(!userData) {
            res.status(404).json({message: "No user found"});
            return;
        }
    
        const user = userData.get({plain: true});
    
        res.render("userprofile", {
            ...user,
            logged_in: true
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
});

router.post("/", async (req, res) => {
    try {
        const userData = await User.create({
            username: req.body.username,
            password: req.body.password
        });

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.logged_in = true;

            res.json(userData);
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const userData = await User.findOne({ where: {email: req.body.email}});

        if(!userData) {
            res.status(400);
            res.json( {message: "Incorrect email or password, please try again."});
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400);
            res.json( { message: "Incorrect password, please try again."});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            re.session.username = userData.username;
            re.session.logged_in = true;
        });
    } catch(err) {
        console.log(err);
        res.status(400).json(err)
    }
});

router.get("/logout", (req, res) => {
    if(req.session.logged_in) {
        req.session.destroy(() => {
            res.status(404).end();
        })
    }
});

module.exports = router;