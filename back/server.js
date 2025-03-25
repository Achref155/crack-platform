const express = require('express');
const multer = require('multer');  // Use multer instead of express-fileupload
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('./config/connect');

const app = express();
app.use(express.json());
app.use(cors());

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, './public/uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes setup
const userRoute = require('./routes/user.route');
const serviceRoute = require('./routes/service.route');
const proposalRoute = require('./routes/proposal.route');
const adminRoute = require('./routes/admin.route');

app.use('/users', userRoute);
app.use('/services', serviceRoute);
app.use('/proposals', proposalRoute);
app.use('/admin', adminRoute);

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.send({
    message: 'File uploaded successfully',
    file: req.file
  });
});

app.use('/image', express.static('./public'));

app.listen(5000, () => console.log('Server is running on port 5000'));