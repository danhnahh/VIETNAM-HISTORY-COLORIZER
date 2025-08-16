# 🇻🇳 DeOldify – Tô màu ảnh lịch sử chiến tranh Việt Nam

## 📖 Giới thiệu
Dự án này sử dụng **[DeOldify](https://github.com/jantic/DeOldify)** kết hợp với **FastAI** để huấn luyện mô hình GAN (Generator + Critic) nhằm tô màu ảnh đen trắng, tập trung vào **ảnh lịch sử chiến tranh Việt Nam**.  

Mô hình được huấn luyện theo chu kỳ:
1. **Huấn luyện Critic** – phân biệt ảnh thật/giả.
2. **Huấn luyện GAN** – đồng thời tối ưu Generator + Critic.
3. **Đánh giá** bằng chỉ số **FID (Fréchet Inception Distance)**.

---

## 📂 Cấu trúc thư mục
```
├── train.py                 # Code huấn luyện chính
├── load_data.py             # Hàm load và xử lý dữ liệu
├── test_image.py            # Hàm test ảnh, tính FID
├── Utils_Lib.py             # TensorBoard utils cho GAN
├── data/                    # Dữ liệu huấn luyện & kiểm thử
│   ├── Color_image/         # Ảnh màu
│   ├── Grayscale_image/     # Ảnh đen trắng
│   ├── train.csv            # Path ảnh huấn luyện
│   ├── val.csv              # Path ảnh validation
│   ├── _critic_dataset/     # Dataset dành cho Critic
│   ├── models/              # Lưu   generator & critic
│   └── fid/                 # Kết quả FID

├── models/                  # Pretrained generator & critic
└── requirements.txt         # Thư viện cần thiết
```

---

## ⚙️ Cài đặt

### Tạo môi trường Conda
```bash
conda env create -f environment.yml
```

---

## 🚀 Huấn luyện mô hình

### 0. Chuẩn bị Pretrained Models
Trước khi huấn luyện, cần tải về các mô hình pretrained của **DeOldify**:

- Generator
- Critic

Bạn có thể tải từ repo gốc của DeOldify hoặc checkpoint huấn luyện trước đó.  
Sau đó đặt các file `.pth` vào thư mục: models/

- ColorizeStable_gen.pth
- ColorizeStable_crit.pth
- ColorizeVideo_gen.pth
- ColorizeVideo_crit.pth

### 1. Train Models
Chạy file `train_stable.py` để bắt đầu huấn luyện tô ảnh: 
```bash
python train_stable.py
```
Hoặc với tô video
```bash
python train_video.py
```

Các tham số quan trọng trong `train.py`:
- `SZ = 192` → kích thước ảnh huấn luyện.
- `BS = 8` → batch size.
- `TOTAL_GAN_EPOCHS = 10` → tổng số epoch.
- `CRITIC_EPOCHS_PER_CYCLE = 4` → số epoch huấn luyện critic mỗi chu kỳ.
- `GAN_EPOCHS_PER_CYCLE = 1` → số epoch huấn luyện GAN mỗi chu kỳ.

---

## 📊 Theo dõi huấn luyện
Sử dụng **TensorBoard**:
```bash
tensorboard --logdir data/tensorboard/Stable --port=6006
```

---

## 🖼️ Kiểm thử và đánh giá
- File `test_image.py` dùng để:
  - Test mô hình trên ảnh mẫu.
  - Tính chỉ số **FID** (so sánh chất lượng ảnh sinh với ảnh thật).  

Ảnh kiểm thử sẽ được lưu trong thư mục `data/val/`.

---

## 📦 Kết quả
- Mô hình cuối cùng được lưu trong thư mục `data/models/`:
  - `ColorizeStable_gen.pth`
  - `ColorizeVideo_gen.pth`
- Điểm FID được lưu tại:  
  ```
  data/fid/Stable/fid.txt
  ```

---

## 👨‍💻 Tác giả
Dự án huấn luyện tô màu ảnh lịch sử chiến tranh Việt Nam bằng DeOldify + FastAI.  
Mọi đóng góp và ý tưởng cải thiện xin vui lòng tạo **issue** hoặc **pull request**.
