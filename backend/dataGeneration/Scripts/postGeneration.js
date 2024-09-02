const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const fs = require('fs');
const { lp_bucket } = require("../../googleCloudStorage.js")

// Create single post based on arguments
function createPost(authorId, multimediaURL, multimediaType) {
    return {
        _id: {
            $oid: new mongoose.Types.ObjectId()
        },
        author: authorId,
        caption: faker.lorem.paragraph(),
        multimediaURL: multimediaURL,
        multimediaType: multimediaType,
        commentsList : [], // List of commentIds
        likesList : [], // List of userIds
        createdAt: {
            $date: faker.date.past({years: 2, refDate: new Date(2000, 0, 1)})
        },
        updatedAt: {
            $date: faker.date.past({years: 2, refDate: new Date(2024, 0, 1)})
        }
    };
}

const createPostMutltimedia = async () => {
        
    let fileURL, fileType, fileExtension, multimediaFileRand = null, mimetype;
    const multimediaTypeRand = Math.floor(Math.random() * 4) // 0: NO, 1: Image, 2: Video, 3: Audio
    // Determine file type for post
    if (multimediaTypeRand === 1){
        fileType = "Image"
        fileExtension = "jpg"
        mimetype = "image/jpeg"
        console.log("image for this post")
    }
    else if (multimediaTypeRand === 2){
        fileType = "Video"
        fileExtension = "mp4"
        mimetype = "video/mp4"
        console.log("video for this post")
    }
    else if (multimediaTypeRand === 3){
        fileType = "Audio"
        fileExtension = "mp3"
        mimetype = "audio/mpeg"
        console.log("audio for this post")
    }
    else{
        console.log("No multimedia for this post")
        return ""
    }

    // Upload to google storage
    multimediaFileRand = Math.floor(Math.random() * 10) + 1
    const multimediaPath = `dataGeneration/PostMultimedia/${fileType}s/${multimediaFileRand}.${fileExtension}`;
    console.log("reading file")
    const fileBuffer = fs.readFileSync(multimediaPath);
    console.log("file read success")
    
    try {

        const uniqueFileName = `${Date.now()}-postMultimedia-${fileType}`;
        const blob = lp_bucket.file(uniqueFileName);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: mimetype  // Set the MIME type for the file
            }
        });

        return new Promise((resolve, reject) => {
            blobStream.on("error", (err) => {
                reject(err);
            });

            blobStream.on("finish", () => {
                const url = process.env.GS_PATH + uniqueFileName
                resolve(url);
            });

            blobStream.end(fileBuffer);
        });
    } catch (error) {
        console.error("Error uploading file to google cloud:", error);
        throw new Error("Error uploading file to google cloud");
    }
}

module.exports = {
    createPost,
    createPostMutltimedia
}