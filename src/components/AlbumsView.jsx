/*
// components/AlbumsView.jsx
import React from 'react';
import { Folder } from 'lucide-react';
import AlbumCard from './AlbumCard';

const AlbumsView = ({ albums, setAlbums, setSelectedAlbum, setCurrentView }) => {
    const createAlbum = () => {
        const name = prompt('Tên album mới:');
        if (name) {
            const newAlbum = {
                id: Date.now(),
                name,
                photos: [],
                createdAt: new Date()
            };
            setAlbums(prev => [...prev, newAlbum]);
        }
    };

    const viewAlbum = (albumId) => {
        setSelectedAlbum(albumId);
        setCurrentView('gallery');
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý album</h2>
                <button
                    onClick={createAlbum}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Tạo album mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map(album => (
                    <AlbumCard
                        key={album.id}
                        album={album}
                        onView={() => viewAlbum(album.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AlbumsView;
*/
// components/AlbumsView.jsx
import React from 'react';
import { Pencil, Trash } from 'lucide-react';
import AlbumCard from './AlbumCard';

const AlbumsView = ({ albums, setAlbums, setSelectedAlbum, setCurrentView }) => {
    const createAlbum = () => {
        const name = prompt('Tên album mới:');
        if (name) {
            const newAlbum = {
                id: Date.now(),
                name,
                photos: [],
                createdAt: new Date()
            };
            setAlbums(prev => [...prev, newAlbum]);
        }
    };

    const renameAlbum = (albumId) => {
        const name = prompt('Nhập tên album mới:');
        if (name) {
            setAlbums(prev =>
                prev.map(album =>
                    album.id === albumId ? { ...album, name } : album
                )
            );
        }
    };

    const deleteAlbum = (albumId) => {
        if (window.confirm('Bạn có chắc muốn xóa album này?')) {
            setAlbums(prev => prev.filter(album => album.id !== albumId));
            setSelectedAlbum(null);
        }
    };

    const viewAlbum = (albumId) => {
        setSelectedAlbum(albumId);
        setCurrentView('gallery');
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Quản lý album</h2>
                <button
                    onClick={createAlbum}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Tạo album mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map(album => (
                    <div
                        key={album.id}
                        className="p-4 border rounded-lg hover:shadow transition"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3
                                className="font-medium cursor-pointer hover:text-blue-500"
                                onClick={() => viewAlbum(album.id)}
                            >
                                {album.name}
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => renameAlbum(album.id)}
                                    className="text-gray-500 hover:text-blue-500"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => deleteAlbum(album.id)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            {album.photos.length} ảnh
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlbumsView;
