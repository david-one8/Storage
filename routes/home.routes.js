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
        // For Cloudinary storage, multer provides req.file.path (URL) and req.file.filename or req.file.public_id depending on lib
        const cloudinaryId = (req.file && (req.file.filename || req.file.public_id || req.file.originalname)) || '';
        const newFile = await fileModel.create({
            path: req.file.path,
            originalname: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            user: req.user.userId,
            customName: customName,
            cloudinaryId: cloudinaryId
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

    router.post('/delete/:id', authMiddleware, async (req, res) => {
        try {
            const file = await fileModel.findOne({ _id: req.params.id, user: req.user.userId });
            if (!file) return res.status(404).json({ error: 'File not found' });

            // Try deleting from Cloudinary when possible
            try {
                const cloudinary = require('cloudinary').v2;
                if (file.cloudinaryId) {
                    // cloudinaryId might be filename or public_id
                    await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: 'auto' });
                }
            } catch (cloudErr) {
                // Log but don't fail the whole operation
                console.warn('Cloudinary deletion failed or not configured:', cloudErr.message || cloudErr);
            }

            await fileModel.deleteOne({ _id: req.params.id });
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        }
    });



module.exports = router;