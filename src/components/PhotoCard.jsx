// components/PhotoCard.jsx
import React from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';

const PhotoCard = ({ photo, onDelete, onView }) => {
    // Hàm tải file
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = photo.src;
        link.download = photo.name || 'media';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="group relative bg-gray-100 rounded-xl overflow-hidden">
            {/* Hiển thị ảnh hoặc video */}
            {photo.type.startsWith('video/') ? (
                <video
                    src={photo.src}
                    className="w-full h-48 object-cover"
                    muted
                    loop
                    autoPlay
                />
            ) : (
                <img
                    src={photo.src}
                    alt={photo.name}
                    className="w-full h-48 object-cover"
                />
            )}

            {/* Nút chức năng */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                        <button
                            onClick={onView}
                            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                        >
                            <Download size={16} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 bg-white rounded-lg shadow hover:bg-red-50 text-red-500"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoCard;
