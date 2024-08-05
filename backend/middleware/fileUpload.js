const multer = require("multer")
const { lp_bucket } = require("../googleCloudStorage")

const upload = multer({
    storage: multer.memoryStorage()
});

const handleFileUpload = async (file) => {
    
    try {
        const uniqueFileName = `${Date.now()}-${file.originalname}`;
        const blob = lp_bucket.file(uniqueFileName);
        const blobStream = blob.createWriteStream();

        return new Promise((resolve, reject) => {
            blobStream.on("error", (err) => {
                reject(err);
            });

            blobStream.on("finish", () => {
                const url = process.env.GS_PATH + uniqueFileName
                resolve(url);
            });

            blobStream.end(file.buffer);
        });
    } catch (error) {
        console.error("Error uploading file to google cloud:", error);
        throw new Error("Error uploading file to google cloud");
    }
};

module.exports = {
    upload,
    handleFileUpload
}