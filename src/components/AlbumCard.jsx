// components/AlbumCard.jsx
import React from 'react';
import { Folder } from 'lucide-react';

const AlbumCard = ({ album, onView }) => {
    return (
        <div className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="text-blue-600" size={24} />
                </div>
                <div>
                    <h3 className="font-semibold">{album.name}</h3>
                    <p className="text-sm text-gray-500">
                        {album.photos.length} ảnh
                    </p>
                </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
                Tạo: {album.createdAt.toLocaleDateString('vi-VN')}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onView}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                    Xem ảnh
                </button>
            </div>
        </div>
    );
};

export default AlbumCard;
