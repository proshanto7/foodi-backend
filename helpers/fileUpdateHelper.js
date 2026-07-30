const fs = require("fs");
const path = require("path");

// handle file update in uploads folder 
exports.fileUpdateHelper = async (oldImagePath, newFileName) => {
  const folderPath = path.join(__dirname, "../uploads");
  const oldFile = oldImagePath?.split("/").pop();
// delete old file if exists
  if (oldFile) {
    // delete old file from uploads folder
    await fs.promises.unlink(`${folderPath}/${oldFile}`);
  }
// return new file path 
  return `${process.env.UPLOADS_BASE_URL}/${newFileName}`;
};
