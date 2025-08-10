
// components/Sidebar.jsx
import React from 'react';
import { Upload, Image, Folder, Settings, Plus } from 'lucide-react';
import NavButton from './NavButton';

const Sidebar = ({
                     currentView,
                     setCurrentView,
                     albums,
                     setAlbums,
                     selectedAlbum,
                     setSelectedAlbum
                 }) => {
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

    return (
        <div className="lg:col-span-1 space-y-4">
            {/* Navigation Menu */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Menu</h2>
                <div className="space-y-2">
                    <NavButton
                        view="upload"
                        icon={Upload}
                        label="Tải ảnh lên"
                        active={currentView === 'upload'}
                        onClick={() => setCurrentView('upload')}
                    />
                    <NavButton
                        view="gallery"
                        icon={Image}
                        label="Thư viện ảnh"
                        active={currentView === 'gallery' && selectedAlbum === null}
                        onClick={() => {
                            setSelectedAlbum(null); // không chọn album nào → hiển thị tất cả
                            setCurrentView('gallery');
                        }}
                    />
                    <NavButton
                        view="albums"
                        icon={Folder}
                        label="Quản lý album"
                        active={currentView === 'albums'}
                        onClick={() => setCurrentView('albums')}
                    />
                    <NavButton
                        view="settings"
                        icon={Settings}
                        label="Cài đặt"
                        active={currentView === 'settings'}
                        onClick={() => setCurrentView('settings')}
                    />
                </div>
            </div>

            {/* Album List */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Albums</h3>
                    <button
                        onClick={createAlbum}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        <Plus size={18} />
                    </button>
                </div>
                <div className="space-y-2">
                    {albums.map(album => (
                        <button
                            key={album.id}
                            onClick={() => {
                                setSelectedAlbum(album.id); // chọn album này
                                setCurrentView('gallery'); // vẫn ở chế độ thư viện
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                                selectedAlbum === album.id
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="font-medium">{album.name}</div>
                            <div className="text-sm text-gray-500">
                                {album.photos.length} ảnh
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;