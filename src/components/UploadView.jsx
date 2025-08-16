//
// import React, { useState, useRef } from 'react';
// import { Upload, Image, Video } from 'lucide-react';
//
// // 💡 Đổi link này thành link ngrok mỗi khi chạy mới
// const API_BASE = "http://localhost:8001";
//
// const UploadView = ({ photos, setPhotos, albums, setAlbums, selectedAlbum }) => {
//     const [processing, setProcessing] = useState(false);
//     const [processingMessage, setProcessingMessage] = useState('');
//     const [resultImage, setResultImage] = useState(null);
//     const [resultVideo, setResultVideo] = useState(null);
//     const fileInputRef = useRef(null);
//
//     // Xử lý ảnh
//     const processImageWithDeOldify = async (file) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         try {
//             const res = await fetch(`${API_BASE}/process_image`, {
//                 method: "POST",
//                 body: formData
//             });
//             if (!res.ok) throw new Error("Lỗi xử lý ảnh");
//             const blob = await res.blob();
//             const imgUrl = URL.createObjectURL(blob);
//             setResultImage(imgUrl);
//             return imgUrl;
//         } catch (err) {
//             console.error(err);
//             return null;
//         }
//     };
//
//     // Xử lý video
//     const processVideoWithDeOldify = async (file) => {
//         const formData = new FormData();
//         formData.append("file", file);
//         try {
//             const res = await fetch(`${API_BASE}/process_video`, {
//                 method: "POST",
//                 body: formData
//             });
//             if (!res.ok) throw new Error("Lỗi xử lý video");
//             const blob = await res.blob();
//             const videoUrl = URL.createObjectURL(blob);
//             setResultVideo(videoUrl);
//             return videoUrl;
//         } catch (err) {
//             console.error("Lỗi xử lý video:", err);
//             return null;
//         }
//     };
//
//     // Tạo thumbnail cho video
//     const createVideoThumbnail = (file) => {
//         return new Promise((resolve) => {
//             const video = document.createElement('video');
//             const canvas = document.createElement('canvas');
//             const ctx = canvas.getContext('2d');
//
//             video.onloadedmetadata = () => {
//                 canvas.width = video.videoWidth;
//                 canvas.height = video.videoHeight;
//                 video.currentTime = 1;
//             };
//
//             video.oncanplay = () => {
//                 ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//                 resolve(canvas.toDataURL('image/png'));
//             };
//
//             video.src = URL.createObjectURL(file);
//         });
//     };
//
//     const handleFileUpload = async (event) => {
//         const files = Array.from(event.target.files);
//
//         for (let file of files) {
//             if (file.type.startsWith('image/')) {
//                 setProcessing(true);
//                 setProcessingMessage('Đang xử lý ảnh...');
//
//                 const reader = new FileReader();
//                 reader.onload = async (e) => {
//                     const processedUrl = await processImageWithDeOldify(file);
//
//                     const newPhoto = {
//                         id: Date.now() + Math.random(),
//                         name: file.name,
//                         src: processedUrl || e.target.result,
//                         originalSrc: e.target.result,
//                         size: file.size,
//                         type: file.type,
//                         mediaType: 'image',
//                         uploadedAt: new Date(),
//                         isProcessed: !!processedUrl,
//                         analysis: null,
//                         albumId: selectedAlbum
//                     };
//
//                     setPhotos(prev => [...prev, newPhoto]);
//                     setAlbums(prev => prev.map(album =>
//                         album.id === selectedAlbum
//                             ? { ...album, photos: [...album.photos, newPhoto.id] }
//                             : album
//                     ));
//
//                     setProcessing(false);
//                     setProcessingMessage('');
//                 };
//                 reader.readAsDataURL(file);
//
//             } else if (file.type.startsWith('video/')) {
//                 setProcessing(true);
//                 setProcessingMessage('Đang tô màu video...');
//
//                 try {
//                     const originalVideoUrl = URL.createObjectURL(file);
//                     const thumbnail = await createVideoThumbnail(file);
//                     const processedVideoUrl = await processVideoWithDeOldify(file);
//
//                     const newVideo = {
//                         id: Date.now() + Math.random(),
//                         name: file.name,
//                         src: processedVideoUrl || originalVideoUrl,
//                         originalSrc: originalVideoUrl,
//                         thumbnail: thumbnail,
//                         size: file.size,
//                         type: file.type,
//                         mediaType: 'video',
//                         uploadedAt: new Date(),
//                         isProcessed: !!processedVideoUrl,
//                         analysis: null,
//                         albumId: selectedAlbum
//                     };
//
//                     setPhotos(prev => [...prev, newVideo]);
//                     setAlbums(prev => prev.map(album =>
//                         album.id === selectedAlbum
//                             ? { ...album, photos: [...album.photos, newVideo.id] }
//                             : album
//                     ));
//
//                 } catch (error) {
//                     console.error('Lỗi xử lý video:', error);
//                 }
//
//                 setProcessing(false);
//                 setProcessingMessage('');
//             }
//         }
//     };
//
//     return (
//         <div className="bg-white p-8 rounded-xl shadow-sm">
//             <h2 className="text-2xl font-semibold mb-6">Tải media lên</h2>
//
//             {processing && (
//                 <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//                     <div className="flex items-center gap-3">
//                         <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
//                         <span className="text-blue-700">{processingMessage}</span>
//                     </div>
//                     {processingMessage.includes('video') && (
//                         <div className="mt-2 text-sm text-blue-600">
//                             💡 Video processing thường mất 2-5 phút tùy độ dài video
//                         </div>
//                     )}
//                 </div>
//             )}
//
//             <div
//                 onClick={() => fileInputRef.current?.click()}
//                 className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
//             >
//                 <div className="flex justify-center items-center gap-4 mb-4">
//                     <Image size={32} className="text-gray-400" />
//                     <Video size={32} className="text-gray-400" />
//                     <Upload size={48} className="text-gray-400" />
//                 </div>
//                 <p className="text-lg font-medium text-gray-600 mb-2">
//                     Kéo thả ảnh/video vào đây hoặc click để chọn
//                 </p>
//                 <p className="text-gray-500">
//                     Hỗ trợ JPG, PNG, MP4, AVI, MOV (tối đa 200MB)
//                 </p>
//             </div>
//
//             <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*,video/*"
//                 onChange={handleFileUpload}
//                 className="hidden"
//             />
//
//             {(resultImage || resultVideo) && (
//                 <div className="mt-6">
//                     {resultImage && (
//                         <div className="mb-4">
//                             <h3 className="text-lg font-semibold mb-2">Ảnh đã tô màu:</h3>
//                             <img src={resultImage} alt="Kết quả DeOldify" className="rounded-lg shadow-md max-w-full" />
//                         </div>
//                     )}
//                     {resultVideo && (
//                         <div>
//                             <h3 className="text-lg font-semibold mb-2">Video đã tô màu:</h3>
//                             <video
//                                 src={resultVideo}
//                                 controls
//                                 className="rounded-lg shadow-md max-w-full"
//                                 style={{ maxHeight: '400px' }}
//                             >
//                                 Trình duyệt không hỗ trợ video
//                             </video>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default UploadView;
import React, {useState, useRef, useEffect} from 'react';
import { Upload, Image, Video } from 'lucide-react';
import {
    adjustBrightness,
    adjustContrast,
    adjustSaturation,
    adjustHue,
    adjustTemperature,
    adjustTint,
    adjustRGB
} from "@utils/imageProcessing";
const API_BASE = "http://localhost:8001";

const UploadView = ({ photos, setPhotos, albums, setAlbums, selectedAlbum }) => {
    const [processing, setProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [resultImage, setResultImage] = useState(null);
    const [resultVideo, setResultVideo] = useState(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [hue, setHue] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [tint, setTint] = useState(0);
    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(0);
    const [blue, setBlue] = useState(0);

    const canvasRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        if (!resultImage || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Tạo Image object từ resultImage (base64 hoặc URL)
        const imgObj = new window.Image();
        imgObj.src = resultImage;

        imgObj.onload = () => {
            canvas.width = imgObj.width;
            canvas.height = imgObj.height;

            // Vẽ ảnh lên canvas
            ctx.drawImage(imgObj, 0, 0);

            imgRef.current = imgObj;
        };
    }, [resultImage]);

// Áp dụng brightness
    useEffect(() => {
        if (!canvasRef.current || !imgRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imgRef.current;
        canvas.width = img.width;
        canvas.height = img.height;

        const tempCanvas = adjustBrightness(img, brightness - 100);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }, [brightness]);

// Áp dụng contrast
    useEffect(() => {
        if (!canvasRef.current || !imgRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imgRef.current;
        canvas.width = img.width;
        canvas.height = img.height;

        const tempCanvas = adjustContrast(img, contrast - 100);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }, [contrast]);

// Áp dụng saturation
    useEffect(() => {
        if (!canvasRef.current || !imgRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imgRef.current;
        canvas.width = img.width;
        canvas.height = img.height;

        const tempCanvas = adjustSaturation(img, saturation);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }, [saturation]);

// Áp dụng hue
    useEffect(() => {
        if (!canvasRef.current || !imgRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imgRef.current;
        canvas.width = img.width;
        canvas.height = img.height;

        const tempCanvas = adjustHue(img, hue);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }, [hue]);

// Áp dụng temperature
    useEffect(() => {
        if (!canvasRef.current || !imgRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imgRef.current;
        canvas.width = img.width;
        canvas.height = img.height;

        const tempCanvas = adjustTemperature(img, temperature);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }, [temperature]);

// Áp dụng tint
    useEffect(() => {
        if (!canvasRef.current || !imgRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imgRef.current;
        canvas.width = img.width;
        canvas.height = img.height;

        const tempCanvas = adjustTint(img, tint);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }, [tint]);

// Áp dụng RGB riêng
    useEffect(() => {
        if (!canvasRef.current || !imgRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const img = imgRef.current;
        canvas.width = img.width;
        canvas.height = img.height;

        const tempCanvas = adjustRGB(img, red, green, blue);
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }, [red, green, blue]);


    const fileInputRef = useRef(null);

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

    const [currentMedia, setCurrentMedia] = useState(null);


    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);

        for (let file of files) {
            if (file.type.startsWith('image/')) {
                setProcessing(true);
                setProcessingMessage('Đang xử lý ảnh...');

                const reader = new FileReader();
                reader.onload = async (e) => {
                    const processedUrl = await processImageWithDeOldify(file);

                    setCurrentMedia({
                        type: 'image',
                        src: processedUrl || e.target.result,
                        originalSrc: e.target.result,
                        name: file.name,
                        isProcessed: !!processedUrl
                    });

                    setProcessing(false);
                    setProcessingMessage('');
                };
                reader.readAsDataURL(file);
            }
            else if (file.type.startsWith('video/')) {
                setProcessing(true);
                setProcessingMessage('Đang tô màu video...');

                try {
                    const originalVideoUrl = URL.createObjectURL(file);
                    const processedVideoUrl = await processVideoWithDeOldify(file);

                    setCurrentMedia({
                        type: 'video',
                        src: processedVideoUrl || originalVideoUrl,
                        originalSrc: originalVideoUrl,
                        name: file.name,
                        isProcessed: !!processedVideoUrl
                    });
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
                    Click để chọn
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

            <div className="mb-4">
                {/* Hiển thị video nếu có */}
                {currentMedia?.type === 'video' && (
                    <>
                        {/* ⭐ Thêm video gốc ở đây */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Video gốc:</h3>
                            <video
                                src={currentMedia.originalSrc}
                                controls
                                className="rounded-lg shadow-md max-w-full"
                                style={{ maxHeight: '400px' }}
                            />
                        </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Video đã tô màu:</h3>
                        <video
                            src={currentMedia.src}
                            controls
                            className="rounded-lg shadow-md max-w-full"
                            style={{ maxHeight: '400px', filter: `brightness(${brightness}%)` }}
                        />
                        {/* Nút Save video */}
                        <button
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            onClick={() => {
                                if (!currentMedia || currentMedia.type !== 'video') return;

                                const newVideo = {
                                    ...currentMedia,
                                    id: Date.now() + Math.random(),
                                    uploadedAt: new Date(),
                                    albumId: selectedAlbum
                                };

                                // Thêm vào photos
                                setPhotos(prev => [...prev, newVideo]);

                                // Cập nhật album
                                setAlbums(prev => prev.map(album =>
                                    album.id === selectedAlbum
                                        ? { ...album, photos: [...album.photos, newVideo.id] }
                                        : album
                                ));

                                alert("Đã lưu video vào album!");
                            }}
                        >
                            Save Video
                        </button>
                    </div>
                    </>
                )}

                {/* Hiển thị ảnh nếu có */}
                {currentMedia?.type === 'image' && (
                    <>
                        {/* ⭐ Thêm ảnh gốc ở đây */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Ảnh gốc:</h3>
                            <img
                                src={currentMedia.originalSrc}
                                alt={currentMedia.name}
                                className="rounded-lg shadow-md max-w-full"
                                style={{ maxHeight: '400px' }}
                            />
                        </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Ảnh đã tô màu:</h3>
                        <canvas
                            ref={canvasRef}
                            className="rounded-lg shadow-md max-w-full"
                        />

                        {/* Sliders chỉ cho ảnh */}
                        <div className="mt-6 space-y-4">
                            {/* Độ sáng */}
                            <div>
                                <label className="block mb-1 font-medium">Độ sáng: {brightness}%</label>
                                <input
                                    type="range"
                                    min="50"
                                    max="150"
                                    value={brightness}
                                    onChange={(e) => setBrightness(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            {/* Tương phản */}
                            <div>
                                <label className="block mb-1 font-medium">Tương phản: {contrast}%</label>
                                <input
                                    type="range"
                                    min="50"
                                    max="150"
                                    value={contrast}
                                    onChange={(e) => setContrast(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            {/* Bão hòa */}
                            <div>
                                <label className="block mb-1 font-medium">Bão hòa: {saturation}%</label>
                                <input
                                    type="range"
                                    min="50"
                                    max="150"
                                    value={saturation}
                                    onChange={(e) => setSaturation(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            {/* Hue */}
                            <div>
                                <label className="block mb-1 font-medium">Hue: {hue}°</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={hue}
                                    onChange={(e) => setHue(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            {/* Nhiệt độ màu */}
                            <div>
                                <label className="block mb-1 font-medium">Nhiệt độ màu: {temperature}</label>
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={temperature}
                                    onChange={(e) => setTemperature(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            {/* Tint */}
                            <div>
                                <label className="block mb-1 font-medium">Tint: {tint}</label>
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={tint}
                                    onChange={(e) => setTint(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            {/* RGB */}
                            <div>
                                <label className="block mb-1 font-medium">Đỏ (R): {red}</label>
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={red}
                                    onChange={(e) => setRed(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Xanh lá (G): {green}</label>
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={green}
                                    onChange={(e) => setGreen(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Xanh dương (B): {blue}</label>
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={blue}
                                    onChange={(e) => setBlue(Number(e.target.value))}
                                    className="w-32 h-1"
                                />
                            </div>

                            {/* Nút Save ảnh vào album */}
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                onClick={() => {
                                    if (!canvasRef.current || !currentMedia) return;

                                    const editedImageData = canvasRef.current.toDataURL("image/png");

                                    const newPhoto = {
                                        id: Date.now() + Math.random(),
                                        name: currentMedia.name || "edited_image.png",
                                        src: editedImageData,
                                        originalSrc: editedImageData,
                                        size: 0, // nếu muốn có size thực, cần tính từ base64
                                        type: "image/png",
                                        mediaType: "image",
                                        uploadedAt: new Date(),
                                        isProcessed: true,
                                        analysis: null,
                                        albumId: selectedAlbum
                                    };

                                    // Thêm vào photos
                                    setPhotos(prev => [...prev, newPhoto]);

                                    // Cập nhật album
                                    setAlbums(prev => prev.map(album =>
                                        album.id === selectedAlbum
                                            ? { ...album, photos: [...album.photos, newPhoto.id] }
                                            : album
                                    ));

                                    alert("Đã lưu ảnh vào album!");
                                }}
                            >
                                Save Ảnh
                            </button>
                        </div>
                    </div>
                    </>
                )}
            </div>

        </div>
    );
};

export default UploadView;

