const router = require('express').Router();
const { User, Post, Comment } = require('../../models');


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
    } catch(err) {
        console.log(err);
        res.json(500).json(err)
    }
});

router.post("/login", async (req, res) => {
    try {
        const userData = await User.findOne({ where: {username: req.body.username}});

        if(!userData) {
            res.status(400);
            res.json( {message: "Incorrect username or password, please try again."});
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
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;