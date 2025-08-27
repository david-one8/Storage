const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const upload = require('../config/multer.config')
const fileModel = require('../models/files.models')


router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search } = req.query;
        
    // Base query - exclude soft-deleted files
    const query = { user: req.user.userId, deleted: { $ne: true } };
        
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

    // Soft-delete: mark as deleted and set deletedAt so we can offer an undo
    router.post('/delete/:id', authMiddleware, async (req, res) => {
        try {
            const file = await fileModel.findOne({ _id: req.params.id, user: req.user.userId });
            if (!file) return res.status(404).json({ error: 'File not found' });

            if (file.deleted) return res.status(400).json({ error: 'File already deleted' });

            file.deleted = true;
            file.deletedAt = new Date();
            await file.save();

            // Respond quickly; permanent deletion handled separately (either by scheduled job or by client calling permanent endpoint)
            res.json({ success: true });
        } catch (err) {
            console.error('Soft delete error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Restore (undo) a soft-deleted file
    router.post('/restore/:id', authMiddleware, async (req, res) => {
        try {
            const file = await fileModel.findOne({ _id: req.params.id, user: req.user.userId });
            if (!file) return res.status(404).json({ error: 'File not found' });

            if (!file.deleted) return res.status(400).json({ error: 'File is not deleted' });

            file.deleted = false;
            file.deletedAt = null;
            await file.save();

            res.json({ success: true });
        } catch (err) {
            console.error('Restore error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Permanent delete: removes from Cloudinary (best-effort) and deletes DB record
    router.post('/delete/permanent/:id', authMiddleware, async (req, res) => {
        try {
            const file = await fileModel.findOne({ _id: req.params.id, user: req.user.userId });
            if (!file) return res.status(404).json({ error: 'File not found' });

            // Try deleting from Cloudinary when possible
            try {
                const cloudinary = require('cloudinary').v2;
                if (file.cloudinaryId) {
                    await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: 'auto' });
                }
            } catch (cloudErr) {
                console.warn('Cloudinary deletion failed or not configured:', cloudErr.message || cloudErr);
            }

            await fileModel.deleteOne({ _id: req.params.id });
            res.json({ success: true });
        } catch (err) {
            console.error('Permanent delete error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Update file name
    router.put('/update/:id', authMiddleware, async (req, res) => {
        try {
            const file = await fileModel.findOne({ _id: req.params.id, user: req.user.userId });
            if (!file) return res.status(404).json({ error: 'File not found' });

            const { customName } = req.body;
            
            if (!customName || customName.trim().length === 0) {
                return res.status(400).json({ error: 'File name cannot be empty' });
            }

            if (customName.trim().length > 255) {
                return res.status(400).json({ error: 'File name is too long (max 255 characters)' });
            }

            file.customName = customName.trim();
            await file.save();

            res.json({ 
                success: true, 
                message: 'File name updated successfully',
                customName: file.customName
            });
        } catch (err) {
            console.error('File update error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    });

module.exports = router;