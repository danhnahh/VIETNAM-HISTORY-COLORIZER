
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const UploadView = ({ photos, setPhotos, albums, setAlbums, selectedAlbum }) => {
    const [processing, setProcessing] = useState(false);
    const [resultImage, setResultImage] = useState(null); // ảnh kết quả DeOldify
    const fileInputRef = useRef(null);

    // Gọi API DeOldify để xử lý ảnh
    const processWithDeOldify = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:8000/process_image", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Lỗi xử lý ảnh");

            const blob = await res.blob();
            const imgUrl = URL.createObjectURL(blob);
            setResultImage(imgUrl); // lưu ảnh kết quả
            return imgUrl;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);

        for (let file of files) {
            if (file.type.startsWith('image/')) {
                setProcessing(true);

                const reader = new FileReader();
                reader.onload = async (e) => {
                    // Gọi AI DeOldify
                    const processedUrl = await processWithDeOldify(file);

                    const newPhoto = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        src: processedUrl || e.target.result, // dùng ảnh xử lý nếu có
                        size: file.size,
                        type: file.type,
                        uploadedAt: new Date(),
                        analysis: null,
                        albumId: selectedAlbum
                    };

                    setPhotos(prev => [...prev, newPhoto]);
                    setAlbums(prev => prev.map(album =>
                        album.id === selectedAlbum
                            ? { ...album, photos: [...album.photos, newPhoto.id] }
                            : album
                    ));

                    setProcessing(false);
                };

                reader.readAsDataURL(file);
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
                        <span className="text-blue-700">Đang xử lý ảnh với DeOldify...</span>
                    </div>
                </div>
            )}

            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
            >
                <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                    Kéo thả ảnh vào đây hoặc click để chọn
                </p>
                <p className="text-gray-500">
                    Hỗ trợ JPG, PNG (tối đa 100MB)
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {resultImage && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Ảnh đã đổi màu:</h3>
                    <img src={resultImage} alt="Kết quả DeOldify" className="rounded-lg shadow-md max-w-full" />
                </div>
            )}
        </div>
    );
};

export default UploadView;
