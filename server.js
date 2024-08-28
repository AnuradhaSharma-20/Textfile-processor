const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Set the destination for file uploads

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

function processText(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g);
    const wordCounts = {};

    words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const mostCommonWord = Object.keys(wordCounts).reduce((a, b) => wordCounts[a] > wordCounts[b] ? a : b);

    const processedText = text.replace(new RegExp(`\\b${mostCommonWord}\\b`, 'gi'), `foo${mostCommonWord}bar`);

    return processedText;
}

app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const text = fs.readFileSync(filePath, 'utf-8');
    const processedText = processText(text);

    fs.unlinkSync(filePath); // Clean up the uploaded file
    res.json({ processed_text: processedText });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});