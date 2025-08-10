// src/utils/imageProcessing.js

/**
 * Compress image file
 * @param {File} file - Image file to compress
 * @param {number} quality - Compression quality (0-1)
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = (file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };

        img.src = URL.createObjectURL(file);
    });
};

/**
 * Get image metadata
 * @param {File} file - Image file
 * @returns {Promise<Object>} Image metadata
 */
export const getImageMetadata = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
                aspectRatio: img.width / img.height,
                size: file.size,
                type: file.type,
                name: file.name
            });
        };
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Create thumbnail from image file
 * @param {File} file - Image file
 * @param {number} size - Thumbnail size
 * @returns {Promise<string>} Thumbnail data URL
 */
export const createThumbnail = (file, size = 150) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;

            // Calculate crop area for square thumbnail
            const minDim = Math.min(img.width, img.height);
            const x = (img.width - minDim) / 2;
            const y = (img.height - minDim) / 2;

            ctx.drawImage(img, x, y, minDim, minDim, 0, 0, size, size);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };

        img.src = URL.createObjectURL(file);
    });
};

/**
 * Simulate AI image analysis
 * @param {File} file - Image file to analyze
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeImage = async (file) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const metadata = await getImageMetadata(file);

    // Mock AI analysis based on image properties
    const mockAnalysis = {
        objects: generateMockObjects(file.name, metadata),
        colors: generateMockColors(),
        emotions: generateMockEmotions(),
        quality: assessImageQuality(metadata),
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        processingTime: Date.now()
    };

    return mockAnalysis;
};

// Helper functions for mock AI analysis
const generateMockObjects = (filename, metadata) => {
    const objects = [
        'người', 'cây', 'bầu trời', 'xe hơi', 'nhà', 'đường', 'hoa', 'động vật',
        'núi', 'biển', 'mây', 'mặt trời', 'cỏ', 'đá', 'cửa sổ', 'cửa'
    ];

    const count = Math.floor(Math.random() * 4) + 2; // 2-5 objects
    return objects.sort(() => 0.5 - Math.random()).slice(0, count);
};

const generateMockColors = () => {
    const colors = [
        'xanh lá', 'xanh dương', 'đỏ', 'vàng', 'cam', 'tím', 'hồng',
        'nâu', 'đen', 'trắng', 'xám', 'be'
    ];

    const count = Math.floor(Math.random() * 3) + 2; // 2-4 colors
    return colors.sort(() => 0.5 - Math.random()).slice(0, count);
};

const generateMockEmotions = () => {
    const emotions = [
        'vui vẻ', 'bình yên', 'tự nhiên', 'năng động', 'lãng mạn',
        'nghiêm túc', 'thư giãn', 'hứng thú', 'ấm áp', 'mát mẻ'
    ];

    const count = Math.floor(Math.random() * 2) + 1; // 1-2 emotions
    return emotions.sort(() => 0.5 - Math.random()).slice(0, count);
};


const assessImageQuality = (metadata) => {
    const { width, height, size } = metadata;
    const megapixels = (width * height) / 1000000;

    if (megapixels > 8 && size > 2000000) return 'rất cao';
    if (megapixels > 4 && size > 1000000) return 'cao';
    if (megapixels > 2 && size > 500000) return 'trung bình';
    return 'thấp';
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG, GIF, WebP.'
        };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File quá lớn. Kích thước tối đa cho phép là 10MB.'
        };
    }

    return { valid: true };
};