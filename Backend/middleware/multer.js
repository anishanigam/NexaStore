import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log("Request Body:", req.body);
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
        console.log("Uploading File:", file.originalname);
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export default upload;
