const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const prompt = 'describe the provided image';

    const imagePart = {
      inlineData: {
        data: Buffer.from(fs.readFileSync(req.file.path)).toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = await response.text();
    console.log(text);
    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image.');
  }
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Google Generative AI</title>
    </head>
    <body>
      <h1>Upload Image</h1>
      <form id="uploadForm" action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="image" accept="image/*">
        <button type="submit">Upload</button>
      </form>
      <div id="response"></div>

      <script>
        document.getElementById('uploadForm').addEventListener('submit', async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          try {
            const response = await fetch(form.action, {
              method: 'POST',
              body: formData
            });
            const data = await response.text();
            document.getElementById('response').innerText = data;
          } catch (error) {
            console.error(error);
            document.getElementById('response').innerText = 'Error processing image.';
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
