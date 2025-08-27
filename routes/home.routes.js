const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const upload = require('../config/multer.config')
const fileModel = require('../models/files.models')


router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search } = req.query;
        
        // Base query
        const query = { user: req.user.userId };
        
        // Add search filter if specified
        if (search) {
            query.originalname = { $regex: search, $options: 'i' };
        }

        const userFiles = await fileModel.find(query);

        res.render('home', {
            files: userFiles,
            search: search || ''
        });

    } catch (err) {
        console.log(err)

        res.status(500).json({
            message: 'Server Error'
        })
    }
})

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded'
            });
        }


        const customName = req.body.customFilename && req.body.customFilename.trim() ? req.body.customFilename.trim() : '';
        const newFile = await fileModel.create({
            path: req.file.path,
            originalname: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            user: req.user.userId,
            customName: customName
        });

        res.redirect('/home/');
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            message: 'Error uploading file'
        });
    }
});


router.get('/download/:id', authMiddleware, async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;
        const fileId = req.params.id;

        const file = await fileModel.findOne({
            user: loggedInUserId,
            _id: fileId
        });

        if (!file) {
            return res.status(404).json({
                message: 'File not found or unauthorized'
            });
        }

        // Since we're using Cloudinary, the file.path contains the direct URL
        res.redirect(file.path);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({
            message: 'Error downloading file'
        });
    }
});




module.exports = router;