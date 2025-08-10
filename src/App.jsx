// App.jsx
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UploadView from './components/UploadView';
import GalleryView from './components/GalleryView';
import AlbumsView from './components/AlbumsView';
import SettingsView from './components/SettingsView';

const App = () => {
    const [currentView, setCurrentView] = useState('upload');
    const [photos, setPhotos] = useState([]);
    const [albums, setAlbums] = useState([
        { id: 1, name: 'Album mặc định', photos: [], createdAt: new Date() }
    ]);
    const [selectedAlbum, setSelectedAlbum] = useState(1);

    const appState = {
        currentView,
        setCurrentView,
        photos,
        setPhotos,
        albums,
        setAlbums,
        selectedAlbum,
        setSelectedAlbum
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'upload':
                return <UploadView {...appState} />;
            case 'gallery':
                return <GalleryView {...appState} />;
            case 'albums':
                return <AlbumsView {...appState} />;
            case 'settings':
                return <SettingsView {...appState} />;
            default:
                return <UploadView {...appState} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-6">
                <Header />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Sidebar {...appState} />

                    <div className="lg:col-span-3">
                        {renderCurrentView()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;