import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const UploadView = ({ photos, setPhotos, albums, setAlbums, selectedAlbum }) => {
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef(null);

    // Giả lập xử lý AI
    const processImage = async (file) => {
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 500)); // giảm delay

        const mockAnalysis = {
            objects: ['người', 'cây', 'bầu trời'],
            colors: ['xanh', 'nâu', 'trắng'],
            emotions: ['vui vẻ', 'tự nhiên'],
            quality: 'cao',
            tags: ['chân dung', 'ngoài trời', 'ánh sáng tự nhiên']
        };

        setProcessing(false);
        return mockAnalysis;
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);

        for (let file of files) {
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const analysis = file.type.startsWith('image/')
                        ? await processImage(file)
                        : null; // video không cần AI tags

                    const newPhoto = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        src: file.type.startsWith('image/')
                            ? e.target.result
                            : URL.createObjectURL(file),
                        size: file.size,
                        type: file.type,
                        uploadedAt: new Date(),
                        analysis,
                        albumId: selectedAlbum
                    };

                    setPhotos(prev => [...prev, newPhoto]);

                    setAlbums(prev => prev.map(album =>
                        album.id === selectedAlbum
                            ? { ...album, photos: [...album.photos, newPhoto.id] }
                            : album
                    ));
                };

                if (file.type.startsWith('image/')) {
                    reader.readAsDataURL(file);
                } else {
                    // Video không cần dataURL -> dùng object URL
                    reader.onload({ target: { result: URL.createObjectURL(file) } });
                }
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Tải media lên</h2>

            {processing && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <span className="text-blue-700">Đang xử lý ảnh với AI...</span>
                    </div>
                </div>
            )}

            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
            >
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                    Kéo thả ảnh/video vào đây hoặc click để chọn
                </p>
                <p className="text-gray-500">
                    Hỗ trợ JPG, PNG, GIF, MP4, WebM (tối đa 100MB)
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
            />
        </div>
    );
};

export default UploadView;