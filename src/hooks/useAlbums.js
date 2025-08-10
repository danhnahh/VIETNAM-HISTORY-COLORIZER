// src/hooks/useAlbums.js
import { useState, useCallback } from 'react';

export const useAlbums = () => {
    const [albums, setAlbums] = useState([
        {
            id: 1,
            name: 'Album mặc định',
            photos: [],
            createdAt: new Date(),
            description: 'Album mặc định cho tất cả ảnh',
            coverPhoto: null,
            isDefault: true
        }
    ]);
    const [selectedAlbum, setSelectedAlbum] = useState(1);

    // Create new album
    const createAlbum = useCallback((name, description = '') => {
        if (!name || !name.trim()) {
            throw new Error('Tên album không được để trống');
        }

        // Check if album name already exists
        const existingAlbum = albums.find(album =>
            album.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (existingAlbum) {
            throw new Error('Tên album đã tồn tại');
        }

        const newAlbum = {
            id: Date.now(),
            name: name.trim(),
            description: description.trim(),
            photos: [],
            createdAt: new Date(),
            coverPhoto: null,
            isDefault: false
        };

        setAlbums(prev => [...prev, newAlbum]);
        return newAlbum;
    }, [albums]);

    // Delete album
    const deleteAlbum = useCallback((albumId) => {
        // Cannot delete default album
        const album = albums.find(a => a.id === albumId);
        if (album?.isDefault) {
            throw new Error('Không thể xóa album mặc định');
        }

        setAlbums(prev => prev.filter(album => album.id !== albumId));

        // If deleted album was selected, switch to default
        if (selectedAlbum === albumId) {
            setSelectedAlbum(1);
        }
    }, [albums, selectedAlbum]);

    // Update album
    const updateAlbum = useCallback((albumId, updates) => {
        setAlbums(prev => prev.map(album =>
            album.id === albumId ? { ...album, ...updates } : album
        ));
    }, []);

    // Add photos to album
    const addPhotosToAlbum = useCallback((albumId, photoIds) => {
        setAlbums(prev => prev.map(album =>
            album.id === albumId
                ? {
                    ...album,
                    photos: [...new Set([...album.photos, ...photoIds])] // Remove duplicates
                }
                : album
        ));
    }, []);

    // Remove photos from album
    const removePhotosFromAlbum = useCallback((albumId, photoIds) => {
        setAlbums(prev => prev.map(album =>
            album.id === albumId
                ? {
                    ...album,
                    photos: album.photos.filter(id => !photoIds.includes(id))
                }
                : album
        ));
    }, []);

    // Move photos between albums
    const movePhotos = useCallback((photoIds, fromAlbumId, toAlbumId) => {
        setAlbums(prev => prev.map(album => {
            if (album.id === fromAlbumId) {
                return {
                    ...album,
                    photos: album.photos.filter(id => !photoIds.includes(id))
                };
            }
            if (album.id === toAlbumId) {
                return {
                    ...album,
                    photos: [...new Set([...album.photos, ...photoIds])]
                };
            }
            return album;
        }));
    }, []);

    // Set album cover photo
    const setAlbumCover = useCallback((albumId, photoId) => {
        setAlbums(prev => prev.map(album =>
            album.id === albumId
                ? { ...album, coverPhoto: photoId }
                : album
        ));
    }, []);

    // Get album by ID
    const getAlbumById = useCallback((albumId) => {
        return albums.find(album => album.id === albumId);
    }, [albums]);

    // Get album stats
    const getAlbumStats = useCallback((albumId) => {
        const album = albums.find(a => a.id === albumId);
        if (!album) return null;

        return {
            id: album.id,
            name: album.name,
            photoCount: album.photos.length,
            createdAt: album.createdAt,
            isDefault: album.isDefault,
            coverPhoto: album.coverPhoto
        };
    }, [albums]);

    // Search albums
    const searchAlbums = useCallback((query) => {
        if (!query.trim()) return albums;

        const searchTerm = query.toLowerCase();
        return albums.filter(album =>
            album.name.toLowerCase().includes(searchTerm) ||
            album.description.toLowerCase().includes(searchTerm)
        );
    }, [albums]);

    // Sort albums
    const sortAlbums = useCallback((sortBy = 'createdAt', order = 'desc') => {
        return [...albums].sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'photoCount') {
                aValue = a.photos.length;
                bValue = b.photos.length;
            }

            if (sortBy === 'createdAt') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (order === 'desc') {
                return bValue > aValue ? 1 : -1;
            } else {
                return aValue > bValue ? 1 : -1;
            }
        });
    }, [albums]);

    // Get all album statistics
    const getAllStats = useCallback(() => {
        const totalAlbums = albums.length;
        const totalPhotos = albums.reduce((sum, album) => sum + album.photos.length, 0);
        const emptyAlbums = albums.filter(album => album.photos.length === 0).length;

        const albumsByPhotoCount = albums.map(album => ({
            name: album.name,
            photoCount: album.photos.length
        })).sort((a, b) => b.photoCount - a.photoCount);

        return {
            totalAlbums,
            totalPhotos,
            emptyAlbums,
            averagePhotosPerAlbum: totalAlbums > 0 ? totalPhotos / totalAlbums : 0,
            albumsByPhotoCount
        };
    }, [albums]);

    // Duplicate album
    const duplicateAlbum = useCallback((albumId) => {
        const sourceAlbum = albums.find(a => a.id === albumId);
        if (!sourceAlbum) {
            throw new Error('Album không tồn tại');
        }

        const duplicatedAlbum = {
            ...sourceAlbum,
            id: Date.now(),
            name: `${sourceAlbum.name} - Copy`,
            createdAt: new Date(),
            isDefault: false
        };

        setAlbums(prev => [...prev, duplicatedAlbum]);
        return duplicatedAlbum;
    }, [albums]);

    return {
        albums,
        selectedAlbum,
        setSelectedAlbum,
        createAlbum,
        deleteAlbum,
        updateAlbum,
        addPhotosToAlbum,
        removePhotosFromAlbum,
        movePhotos,
        setAlbumCover,
        getAlbumById,
        getAlbumStats,
        searchAlbums,
        sortAlbums,
        getAllStats,
        duplicateAlbum
    };
};
