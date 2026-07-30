const fs = require("fs");
const path = require("path");
// delete file from uploads folder 
exports.deleteFile = async (imagePath) => {
  const folderPath = path.join(__dirname, "../uploads");
  const fileName = imagePath?.split("/").pop();

  if (fileName) {
    await fs.promises.unlink(`${folderPath}/${fileName}`);
  }
  return true;
};
