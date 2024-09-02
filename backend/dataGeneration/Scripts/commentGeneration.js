const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

// Λειτουργία για τη δημιουργία θέσεων εργασίας (jobs)
function createComment(postId, authorId) {
    return {
        _id: {
            $oid: new mongoose.Types.ObjectId()
        },
        post: postId,
        author: authorId,
        content: faker.lorem.sentence(),
        createdAt: {
            $date: faker.date.past({years: 2, refDate: new Date(2000, 0, 1)})
        },
        updatedAt: {
            $date: faker.date.past({years: 2, refDate: new Date(2024, 0, 1)})
        }
    };
}

module.exports = {
    createComment
}