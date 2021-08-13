const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

const userData = require("./userSeedData.json");
const postData = require("./postSeedData.json");
const commentData = require("./commentSeedData.json")

const seedDatabase = async() => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    for (const post of postData) {
        await Post.create({
            ...post,
            user_id: users.id
        });
    }
    
    for (const comment of commentData) {
        await Comment.create({
            ...comment,
            user_id: users.id
        })
    }

    process.exit(0);
};

seedDatabase();