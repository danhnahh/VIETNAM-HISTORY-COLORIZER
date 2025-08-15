import cv2
import os
import shutil  # Thư viện cần thiết để xóa thư mục

video_path = 'Movie\\DLDB22.mp4'
# Thư mục gốc để chứa các thư mục con
base_data_folder = '..\\data'

# Số lượng frame muốn trích xuất.
# tùy video sẽ chọn số frame phù hợp
num_frames_to_extract = 400

# --- BẮT ĐẦU XỬ LÝ ---

def extract_frames():
    """
    Hàm chính để mở video, tính toán và trích xuất các frame.
    """
    # Kiểm tra xem file video có tồn tại không
    if not os.path.exists(video_path):
        print(f"Lỗi: Không tìm thấy file video tại đường dẫn '{video_path}'")
        return

    #  Tự động tạo đường dẫn thư mục output dựa trên tên video
    # Lấy tên file không bao gồm phần mở rộng (ví dụ: 'NBDL.mp4' -> 'NBDL')
    video_name_without_ext = os.path.splitext(os.path.basename(video_path))[0]
    
    # Nối tên đó vào thư mục data gốc để có đường dẫn đầy đủ
    output_folder = os.path.join(base_data_folder, video_name_without_ext)

    # 3. Xóa thư mục output cũ (nếu có) và tạo lại
    if os.path.exists(output_folder):
        print(f"Thư mục '{output_folder}' đã tồn tại. Đang xóa...")
        shutil.rmtree(output_folder)  # Xóa toàn bộ thư mục và nội dung bên trong
    
    print(f"Tạo thư mục lưu trữ mới: {output_folder}")
    os.makedirs(output_folder)  # Tạo lại thư mục rỗng

    # 4. Mở file video bằng OpenCV
    cap = cv2.VideoCapture(video_path)

    # Kiểm tra xem video có mở được không
    if not cap.isOpened():
        print(f"Lỗi: Không thể mở file video.")
        return

    # 5. Lấy tổng số frame của video
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video có tổng cộng {total_frames} frames.")

    # Kiểm tra xem video có đủ dài để trích xuất không
    if total_frames < num_frames_to_extract:
        print(f"Lỗi: Video quá ngắn để có thể trích xuất {num_frames_to_extract} frames.")
        cap.release()
        return

    # 6. Tính toán các vị trí frame cần lấy để đảm bảo chúng cách đều nhau
    # Xử lý trường hợp chỉ lấy 1 frame để tránh lỗi chia cho 0
    if num_frames_to_extract == 1:
        frame_indices = [0]
    else:
        frame_indices = [int(i * (total_frames - 1) / (num_frames_to_extract - 1)) for i in range(num_frames_to_extract)]

    print(f"Sẽ trích xuất các frame tại vị trí: {frame_indices}")

    # 7. Lặp qua các vị trí đã tính và lưu frame
    for i, frame_index in enumerate(frame_indices):
        # Di chuyển con trỏ đọc đến đúng vị trí frame
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_index)

        # Đọc frame tại vị trí đó
        success, frame = cap.read()

        if success:
            # Tạo tên file cho frame (ví dụ: frame_1.jpg, frame_2.jpg, ...)
            output_filename = os.path.join(output_folder, f"frame_{i+1}.jpg")
            
            # Lưu frame thành file ảnh JPEG
            cv2.imwrite(output_filename, frame)
            print(f"-> Đã lưu thành công: {output_filename}")
        else:
            print(f"Lỗi: Không thể đọc frame tại vị trí {frame_index}.")

    # 8. Giải phóng tài nguyên sau khi hoàn thành
    cap.release()
    print(f"\nHoàn thành! Tất cả các frame đã được trích xuất vào thư mục '{output_folder}'.")

# Gọi hàm chính để chạy chương trình
if __name__ == "__main__":
    extract_frames()