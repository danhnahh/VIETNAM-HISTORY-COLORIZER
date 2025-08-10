// src/hooks/usePhotos.js
import { useState, useCallback } from 'react';
import { analyzeImage, validateImageFile } from '@utils/imageProcessing';

export const usePhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Add new photos
    const addPhotos = useCallback(async (files, albumId) => {
        setLoading(true);
        setError(null);

        const validFiles = [];
        const errors = [];

        // Validate files
        for (const file of files) {
            const validation = validateImageFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        }

        if (errors.length > 0) {
            setError(errors.join('\n'));
        }

        // Process valid files
        const newPhotos = [];
        for (const file of validFiles) {
            try {
                const reader = new FileReader();
                const imageData = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });

                const analysis = await analyzeImage(file);

                const photo = {
                    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    src: imageData,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date(),
                    analysis,
                    albumId: albumId || 1,
                    metadata: {
                        originalName: file.name,
                        lastModified: file.lastModified
                    }
                };

                newPhotos.push(photo);
            } catch (err) {
                console.error('Error processing file:', file.name, err);
                errors.push(`${file.name}: Lỗi xử lý file`);
            }
        }

        setPhotos(prev => [...prev, ...newPhotos]);
        setLoading(false);

        return newPhotos;
    }, []);

    // Delete photo
    const deletePhoto = useCallback((photoId) => {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    }, []);

    // Update photo
    const updatePhoto = useCallback((photoId, updates) => {
        setPhotos(prev => prev.map(photo =>
            photo.id === photoId ? { ...photo, ...updates } : photo
        ));
    }, []);

    // Get photos by album
    const getPhotosByAlbum = useCallback((albumId, photoIds = []) => {
        if (photoIds.length > 0) {
            return photos.filter(photo => photoIds.includes(photo.id));
        }
        return photos.filter(photo => photo.albumId === albumId);
    }, [photos]);

    // Search photos
    const searchPhotos = useCallback((query) => {
        if (!query.trim()) return photos;

        const searchTerm = query.toLowerCase();
        return photos.filter(photo => {
            const searchableText = [
                photo.name,
                ...(photo.analysis?.tags || []),
                ...(photo.analysis?.objects || []),
                ...(photo.analysis?.colors || []),
                ...(photo.analysis?.emotions || [])
            ].join(' ').toLowerCase();

            return searchableText.includes(searchTerm);
        });
    }, [photos]);

    // Filter photos by criteria
    const filterPhotos = useCallback((criteria) => {
        return photos.filter(photo => {
            // Filter by date range
            if (criteria.dateFrom && new Date(photo.uploadedAt) < new Date(criteria.dateFrom)) {
                return false;
            }
            if (criteria.dateTo && new Date(photo.uploadedAt) > new Date(criteria.dateTo)) {
                return false;
            }

            // Filter by file type
            if (criteria.fileType && !photo.type.includes(criteria.fileType)) {
                return false;
            }

            // Filter by tags
            if (criteria.tags && criteria.tags.length > 0) {
                const photoTags = photo.analysis?.tags || [];
                return criteria.tags.some(tag => photoTags.includes(tag));
            }

            // Filter by quality
            if (criteria.quality && photo.analysis?.quality !== criteria.quality) {
                return false;
            }

            return true;
        });
    }, [photos]);

    // Get photo statistics
    const getStats = useCallback(() => {
        const totalSize = photos.reduce((sum, photo) => sum + photo.size, 0);
        const totalPhotos = photos.length;

        const typeStats = photos.reduce((acc, photo) => {
            const type = photo.type.split('/')[1];
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        const qualityStats = photos.reduce((acc, photo) => {
            const quality = photo.analysis?.quality || 'unknown';
            acc[quality] = (acc[quality] || 0) + 1;
            return acc;
        }, {});

        return {
            totalPhotos,
            totalSize,
            typeStats,
            qualityStats,
            averageSize: totalPhotos > 0 ? totalSize / totalPhotos : 0
        };
    }, [photos]);

    // Bulk operations
    const bulkDelete = useCallback((photoIds) => {
        setPhotos(prev => prev.filter(photo => !photoIds.includes(photo.id)));
    }, []);

    const bulkMoveToAlbum = useCallback((photoIds, albumId) => {
        setPhotos(prev => prev.map(photo =>
            photoIds.includes(photo.id) ? { ...photo, albumId } : photo
        ));
    }, []);

    return {
        photos,
        loading,
        error,
        addPhotos,
        deletePhoto,
        updatePhoto,
        getPhotosByAlbum,
        searchPhotos,
        filterPhotos,
        getStats,
        bulkDelete,
        bulkMoveToAlbum,
        setError
    };
};