import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const baseUploadDir = path.resolve(process.cwd(), 'uploads');

const verificaDir = (dir) => {
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive:true})
    }
}

const uploadImageMiddleware = () => {
    const uploadDir = path.join(baseUploadDir, 'images');

    verificaDir(uploadDir);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir)
        },
        filename: (req, file, cb) => {
            const hash = crypto.randomBytes(12).toString('hex');
            cb(null, `${hash}-${file.originalname}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if(!allowedTypes.includes(file.mimetype)){
            return cb(new Error('Tipo de arquivo não permitido. Apenas jpeg, png, gif e webp são aceitos.'));
        }
        cb(null, true);
    }

    return multer({
        storage,
        limits: {fileSize: 5 * 1024 * 1024}, // 5MB
        fileFilter
    }).single('imagem');
}

export default uploadImageMiddleware;
