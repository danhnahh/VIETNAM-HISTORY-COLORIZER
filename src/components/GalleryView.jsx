/*

// components/GalleryView.jsx
import React, { useState } from 'react';
import { Search, Filter, Image } from 'lucide-react';
import PhotoCard from './PhotoCard';

const GalleryView = ({ photos, setPhotos, albums, setAlbums, selectedAlbum }) => {
    const [selectedMedia, setSelectedMedia] = useState(null);

    const getAlbumPhotos = (albumId) => {
        const album = albums.find(a => a.id === albumId);
        return photos.filter(photo => album?.photos.includes(photo.id));
    };

    const deletePhoto = (photoId) => {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        setAlbums(prev => prev.map(album => ({
            ...album,
            photos: album.photos.filter(id => id !== photoId)
        })));
    };

    const albumPhotos = getAlbumPhotos(selectedAlbum);

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Thư viện media</h2>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <Search size={18} />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {albumPhotos.length === 0 ? (
                <div className="text-center py-12">
                    <Image size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Chưa có media nào trong album này</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albumPhotos.map(photo => (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            onDelete={() => deletePhoto(photo.id)}
                            onView={() => setSelectedMedia(photo)}
                        />
                    ))}
                </div>
            )}

            {/!* Modal xem chi tiết *!/}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div className="max-w-4xl w-full p-4">
                        {selectedMedia.type.startsWith('image/') ? (
                            <img
                                src={selectedMedia.src}
                                alt={selectedMedia.name}
                                className="max-h-[80vh] mx-auto rounded-lg"
                            />
                        ) : (
                            <video
                                src={selectedMedia.src}
                                controls
                                autoPlay
                                className="max-h-[80vh] mx-auto rounded-lg"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryView;
*/
// components/GalleryView.jsx
import React, { useState } from 'react';
import { Search, Filter, Image } from 'lucide-react';
import PhotoCard from './PhotoCard';

const GalleryView = ({ photos, setPhotos, albums, setAlbums, selectedAlbum }) => {
    const [selectedMedia, setSelectedMedia] = useState(null);

    // Lấy media để hiển thị
    const getDisplayedMedia = () => {
        if (selectedAlbum === null) {
            // Hiển thị tất cả ảnh/video từ tất cả album
            const allPhotoIds = albums.flatMap(a => a.photos);
            return photos.filter(p => allPhotoIds.includes(p.id));
        } else {
            // Chỉ ảnh/video của album được chọn
            const album = albums.find(a => a.id === selectedAlbum);
            return photos.filter(photo => album?.photos.includes(photo.id));
        }
    };

    const deletePhoto = (photoId) => {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        setAlbums(prev => prev.map(album => ({
            ...album,
            photos: album.photos.filter(id => id !== photoId)
        })));
    };

    const displayedMedia = getDisplayedMedia();

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Thư viện media</h2>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <Search size={18} />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {displayedMedia.length === 0 ? (
                <div className="text-center py-12">
                    <Image size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Chưa có media nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedMedia.map(photo => (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            onDelete={() => deletePhoto(photo.id)}
                            onView={() => setSelectedMedia(photo)}
                        />
                    ))}
                </div>
            )}

            {/* Modal xem chi tiết */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div className="max-w-4xl w-full p-4">
                        {selectedMedia.type.startsWith('image/') ? (
                            <img
                                src={selectedMedia.src}
                                alt={selectedMedia.name}
                                className="max-h-[80vh] mx-auto rounded-lg"
                            />
                        ) : (
                            <video
                                src={selectedMedia.src}
                                controls
                                autoPlay
                                className="max-h-[80vh] mx-auto rounded-lg"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryView;
