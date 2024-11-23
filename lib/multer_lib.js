import multer from 'multer'

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false);
    }

    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const file_extension = file.mimetype.split("/")[1]
      cb(null, `${Date.now()}.${file_extension}`)
    },  
    fileFilter,
    limits: {
        fileSize: 1000000,
    },
})

export const upload = multer({storage: storage});