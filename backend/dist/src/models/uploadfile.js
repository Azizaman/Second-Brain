var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const path = require('path');
function uploadFile(filePath, fileType) {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = 'mongodb+srv://azizamanaaa97:2s3354LUZe0BzSu7@cluster0.tyjfznw.mongodb.net/second-brain'; // Your MongoDB URI
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            yield client.connect();
            const db = client.db('fileStorage'); // Your database name
            const bucket = new GridFSBucket(db, {
                bucketName: 'files',
            });
            const uploadStream = bucket.openUploadStream(path.basename(filePath), { contentType: fileType });
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(uploadStream)
                .on('finish', () => {
                console.log('File uploaded successfully!');
            })
                .on('error', (err) => {
                console.error('Error uploading file:', err);
            });
        }
        catch (err) {
            console.error('Error connecting to MongoDB:', err);
        }
    });
}
// Example usage
uploadFile('./path/to/your/file.pdf', 'application/pdf');
