
import React, { useState, useRef } from 'react';
import { Upload, Image, Video } from 'lucide-react';

// 💡 Đổi link này thành link ngrok mỗi khi chạy mới
const API_BASE = "http://localhost:8001";

const UploadView = ({ photos, setPhotos, albums, setAlbums, selectedAlbum }) => {
    const [processing, setProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [resultImage, setResultImage] = useState(null);
    const [resultVideo, setResultVideo] = useState(null);
    const fileInputRef = useRef(null);

    // Xử lý ảnh
    const processImageWithDeOldify = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`${API_BASE}/process_image`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error("Lỗi xử lý ảnh");
            const blob = await res.blob();
            const imgUrl = URL.createObjectURL(blob);
            setResultImage(imgUrl);
            return imgUrl;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    // Xử lý video
    const processVideoWithDeOldify = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`${API_BASE}/process_video`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error("Lỗi xử lý video");
            const blob = await res.blob();
            const videoUrl = URL.createObjectURL(blob);
            setResultVideo(videoUrl);
            return videoUrl;
        } catch (err) {
            console.error("Lỗi xử lý video:", err);
            return null;
        }
    };

    // Tạo thumbnail cho video
    const createVideoThumbnail = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                video.currentTime = 1;
            };

            video.oncanplay = () => {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/png'));
            };

            video.src = URL.createObjectURL(file);
        });
    };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);

        for (let file of files) {
            if (file.type.startsWith('image/')) {
                setProcessing(true);
                setProcessingMessage('Đang xử lý ảnh...');

                const reader = new FileReader();
                reader.onload = async (e) => {
                    const processedUrl = await processImageWithDeOldify(file);

                    const newPhoto = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        src: processedUrl || e.target.result,
                        originalSrc: e.target.result,
                        size: file.size,
                        type: file.type,
                        mediaType: 'image',
                        uploadedAt: new Date(),
                        isProcessed: !!processedUrl,
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
                    setProcessingMessage('');
                };
                reader.readAsDataURL(file);

            } else if (file.type.startsWith('video/')) {
                setProcessing(true);
                setProcessingMessage('Đang tô màu video...');

                try {
                    const originalVideoUrl = URL.createObjectURL(file);
                    const thumbnail = await createVideoThumbnail(file);
                    const processedVideoUrl = await processVideoWithDeOldify(file);

                    const newVideo = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        src: processedVideoUrl || originalVideoUrl,
                        originalSrc: originalVideoUrl,
                        thumbnail: thumbnail,
                        size: file.size,
                        type: file.type,
                        mediaType: 'video',
                        uploadedAt: new Date(),
                        isProcessed: !!processedVideoUrl,
                        analysis: null,
                        albumId: selectedAlbum
                    };

                    setPhotos(prev => [...prev, newVideo]);
                    setAlbums(prev => prev.map(album =>
                        album.id === selectedAlbum
                            ? { ...album, photos: [...album.photos, newVideo.id] }
                            : album
                    ));

                } catch (error) {
                    console.error('Lỗi xử lý video:', error);
                }

                setProcessing(false);
                setProcessingMessage('');
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
                        <span className="text-blue-700">{processingMessage}</span>
                    </div>
                    {processingMessage.includes('video') && (
                        <div className="mt-2 text-sm text-blue-600">
                            💡 Video processing thường mất 2-5 phút tùy độ dài video
                        </div>
                    )}
                </div>
            )}

            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
            >
                <div className="flex justify-center items-center gap-4 mb-4">
                    <Image size={32} className="text-gray-400" />
                    <Video size={32} className="text-gray-400" />
                    <Upload size={48} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-600 mb-2">
                    Kéo thả ảnh/video vào đây hoặc click để chọn
                </p>
                <p className="text-gray-500">
                    Hỗ trợ JPG, PNG, MP4, AVI, MOV (tối đa 200MB)
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

            {(resultImage || resultVideo) && (
                <div className="mt-6">
                    {resultImage && (
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Ảnh đã tô màu:</h3>
                            <img src={resultImage} alt="Kết quả DeOldify" className="rounded-lg shadow-md max-w-full" />
                        </div>
                    )}
                    {resultVideo && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Video đã tô màu:</h3>
                            <video
                                src={resultVideo}
                                controls
                                className="rounded-lg shadow-md max-w-full"
                                style={{ maxHeight: '400px' }}
                            >
                                Trình duyệt không hỗ trợ video
                            </video>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadView;
