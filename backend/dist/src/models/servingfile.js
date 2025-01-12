var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function downloadFile(fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        const uri = 'mongodb+srv://azizamanaaa97:2s3354LUZe0BzSu7@cluster0.tyjfznw.mongodb.net/second-brain'; // Your MongoDB URI
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            yield client.connect();
            const db = client.db('fileStorage'); // Your database name
            const bucket = new GridFSBucket(db, { bucketName: 'files' });
            const downloadStream = bucket.openDownloadStream(fileId);
            downloadStream.pipe(fs.createWriteStream('./downloadedFile.pdf'));
        }
        catch (err) {
            console.error('Error connecting to MongoDB:', err);
        }
    });
}
// Example usage: Download file with a specific fileId
downloadFile('your-file-id-here');
