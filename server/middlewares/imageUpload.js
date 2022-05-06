const multer = require("multer"); //midd. carrega arquivos multipart/form-data
const path = require("path");

//Armazenamento de img
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }
    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      //verificação de img
      return cb(new Error("Por favor, envie apenas png ou jpg!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };