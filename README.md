# AI Photo/Video Coloring App

Ứng dụng web cho phép tải lên ảnh/video, tô màu tự động bằng AI, và quản lý album.  
Được xây dựng với React + Vite, TailwindCSS và cấu trúc module hóa dễ mở rộng.

## Tính năng chính

- Quản lý album: tạo album, xem album, phân loại ảnh/video.
- Upload ảnh/video: hỗ trợ tải lên nhiều định dạng file.
- Xử lý ảnh bằng AI: tô màu ảnh/video đen trắng tự động.
- Xem lại ảnh/video: duyệt qua ảnh đã tải lên và xử lý.
- Cài đặt người dùng: tuỳ chỉnh các thông số AI và hiển thị.

## Cấu trúc thư mục

src/
│── assets/ # Lưu trữ tài nguyên tĩnh
│── components/ # Các component giao diện chính
│ ├── AlbumCard.jsx
│ ├── AlbumsView.jsx
│ ├── GalleryView.jsx
│ ├── Header.jsx
│ ├── NavButton.jsx
│ ├── PhotoCard.jsx
│ ├── SettingsView.jsx
│ ├── Sidebar.jsx
│ └── UploadView.jsx
│
│── hooks/ # Custom hooks quản lý state
│ ├── useAlbums.js
│ └── usePhotos.js
│
│── utils/ # Hàm tiện ích xử lý
│ └── imageProcessing.js
│
│── App.jsx # Component gốc
│── App.css # CSS cho App
│── index.css # Global CSS
│── main.jsx # Điểm khởi chạy ứng dụng


## Công nghệ sử dụng

- React + Vite
- TailwindCSS
- ESLint
- Custom Hooks
- AI Processing (DeOldify / GAN)

## Cài đặt

1. Clone dự án:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
Cài đặt dependencies:

bash
Copy
Edit
npm install
Chạy thử
Chạy ứng dụng ở chế độ phát triển:

bash
Copy
Edit
npm run dev



