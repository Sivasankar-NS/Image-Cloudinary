// const express = require('express');
// const cloudinary = require('cloudinary').v2;
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const mongoose = require('mongoose');
// const cors  = require('cors')

// const app = express();

// // Configure Cloudinary with your credentials

// cloudinary.config({
//     cloud_name: 'dxroitrhz',
//     api_key: '454934146854713',
//     api_secret: 'mq9UKQUk3DpQ_W3V_-W_SJfZMVE',
//     secure: true,
//   });

// // Connect to MongoDB (replace 'your_database_url' with your MongoDB URL)
// mongoose.connect('mongodb://127.0.0.1:27017/filecloud', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(()=>{
//     console.log('Connected to MongoDB');
// }).catch(()=>{
//     console.log('not Connected ');  
// })

// // Define a schema for storing image data
// const imageSchema = new mongoose.Schema({
//     imageUrl: String,
// });

// const Image = mongoose.model('Image', imageSchema);

// // Middleware for parsing JSON and form data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors())

// // Configure Multer for handling file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Define the upload route
// app.post('/upload', upload.single('image'), async (req, res) => {
//   // Check if an image was uploaded
//   if (!req.file) {
//     return res.status(400).json({ message: 'No image file provided' });
//   }

//   // Upload the image to Cloudinary
//   cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
//     if (error) {
//       return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
//     }


//     // If successful, save the Cloudinary URL to MongoDB
//     const newImage = new Image({ imageUrl: result.url });
//     await newImage.save();


//     // Respond with the Cloudinary URL
//     res.json({ imageUrl: result.url });
//   }).end(req.file.buffer);
// });


// const PORT = process.env.PORT || 7000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dxroitrhz',
  api_key: '454934146854713',
  api_secret: 'mq9UKQUk3DpQ_W3V_-W_SJfZMVE',
  secure: true,
});

// Connect to MongoDB (replace 'your_database_url' with your MongoDB URL)
mongoose
  .connect('mongodb://127.0.0.1:27017/filecloud', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(() => {
    console.log('Not Connected');
  });

// Define a schema for storing file data
const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  data: Buffer,
});

const File = mongoose.model('File', fileSchema);

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the upload route to accept any file type
app.post('/upload', upload.single('file'), async (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file provided' });
  }

  // Upload the file to Cloudinary
  cloudinary.uploader.upload_stream({}, async (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }

    // If successful, save file information to MongoDB
    const newFile = new File({
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      data: req.file.buffer,
    });
    await newFile.save();

    // Respond with the Cloudinary URL
    res.json({ fileUrl: result.url });
  }).end(req.file.buffer);
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
