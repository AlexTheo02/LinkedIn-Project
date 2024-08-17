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

const deleteFile = async (fileURL) => {
    try {
      // Delete the file
      // trim GS_PATH from fileName to keep the original fileName
      const fileName = fileURL.replace(process.env.GS_PATH, "");

      await lp_bucket.file(fileName).delete();
      console.log(`File ${fileName} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
};

module.exports = {
    upload,
    handleFileUpload,
    deleteFile
}