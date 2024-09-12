const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

function createComment(post, authorId) {
    postCreationDate = new Date(post.createdAt.$date.toString())
    return {
        _id: {
            $oid: new mongoose.Types.ObjectId()
        },
        post: post._id,
        author: authorId,
        content: faker.lorem.sentence(),
        createdAt: {
            $date: faker.date.between({from: postCreationDate, to: '2024-09-03'})
        },
        updatedAt: {
            $date: faker.date.between({from: '2024-09-04', to: Date.now() })
        }
    };
}

module.exports = {
    createComment
}