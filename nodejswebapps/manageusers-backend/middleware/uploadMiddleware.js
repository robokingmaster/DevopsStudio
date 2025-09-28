const multer = require('multer');
const path = require('path');
const logger = require('../logger');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const tempName = `${Date.now()}-${file.originalname}`;
    logger.debug('Uploading file with temp name as => ', `${Date.now()}-${file.originalname}`)
    cb(null, tempName);
  },
});

const upload = multer({ storage });

module.exports = upload;
