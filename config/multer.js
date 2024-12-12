import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  

    const uploadPath = path.join("public/images/uploads", req.user._id);

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {

    crypto.randomBytes(12, (err, buffer) => {
      if (err) {
        return cb(err);
      }

      const filePath = path.join( buffer.toString("hex") + path.extname(file.originalname));
      console.log(filePath);
      cb(null, filePath);
    });
  },
});

const upload = multer({ storage: storage });

export default upload;
