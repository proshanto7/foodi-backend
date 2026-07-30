const multer = require("multer");

function uploadFile(
  allowedExtensions,
  maxFileSizeMB,
  uploadPath = "./uploads",
) {
  // Allowed extensions list
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.mimetype.split("/")[1];
      cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
    },
  });
  // File filter for controlling extensions
  const fileFilter = (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only " + allowedExtensions.join(", ") + " files are allowed!",
        ),
        false,
      );
    }
  };
  // Multer middleware to handle file uploads
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxFileSizeMB * 1024 * 1024 },
  });
}

module.exports = uploadFile;
