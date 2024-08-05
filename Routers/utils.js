const multer = require("multer");
require("dotenv").config();
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { default: axios } = require("axios");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const newStorage = multer.memoryStorage(); // Store file in memory as buffer
const upload = multer({ storage: newStorage });

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const absolutePath = path.join(__dirname, `../assets/uploads`);
    cb(null, absolutePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Create a new filename with the original extension
    const newFilename = uniqueSuffix + file.originalname;

    cb(null, newFilename);
  },
});

const storage = multer({ storage: Storage });

// upload the file

router.post("/uploadfile", storage.single("myfile"), (req, res) => {
  const fileName = req.file.filename;
  res.status(200).json({
    message: "Successfully Uploaded",
    fileName: `${fileName}`,
  });
});

// Upload on s3 bucket

router.post("/s3/upload", async (req, res) => {
  const { fileName } = req.query;
  const fileExtension = path.extname(fileName).toLowerCase();

  // Generate the file Name And Path
  const GeneratePath = `${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: "mysmsuploads",
    Key: GeneratePath,
    ContentType: `image/${fileExtension.substr(1)}`,
  });

  const UploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 120 });
  res
    .status(200)
    .json({ error: false, url: UploadUrl, UploadedPath: GeneratePath });
});

router.post("/upload/file", upload.single("file"), async (req, res) => {
  const { fileName } = req.query;
  const file = req.file;

  try {
    const generatePath = `${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: "mysmsuploads",
      Key: generatePath,
      ContentType: file ? file.mimetype : "application/octet-stream",
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 120 });

    const _uploadIt = await axios.put(uploadUrl, file.buffer, {
      headers: {
        "Content-Type": file.mimetype,
      },
    });

    if (_uploadIt.status !== 200)
      return res
        .status(400)
        .json({ error: true, message: "Failed to upload file" });

    res.status(200).json({
      error: false,
      message: "Success",
      fileName: `https://mysmsuploads.s3.ap-south-1.amazonaws.com/${generatePath}`,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

module.exports = router;

// https://mysmsuploads.s3.ap-south-1.amazonaws.com/
