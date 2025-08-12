

from deoldify import device
from deoldify.device_id import DeviceId
device.set(device=DeviceId.GPU0)

from deoldify.visualize import *
plt.style.use('dark_background')
torch.backends.cudnn.benchmark=True

import warnings
warnings.filterwarnings("ignore", category=UserWarning, message=".*?Your .*? set is empty.*?")

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
#import torch
import io
from PIL import Image
import uuid
import os

# ===== Khởi tạo FastAPI =====
app = FastAPI()

# Cho phép React gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model DeOldify
colorizer = get_image_colorizer(artistic=False)

@app.post("/process_image")
async def process_image(file: UploadFile = File(...)):
    # Lưu file input tạm

    if torch.cuda.is_available():
        print(f"✅ Đang dùng GPU: {torch.cuda.get_device_name(0)}")
        print(f"    CUDA version: {torch.version.cuda}")
    else:
        print("⚠ Không tìm thấy GPU, đang chạy bằng CPU!")
    input_filename = f"temp_input_{uuid.uuid4().hex}.png"
    with open(input_filename, "wb") as f:
        f.write(await file.read())

    # Xử lý ảnh bằng DeOldify
    result_img = colorizer.get_transformed_image(
        path=input_filename,
        render_factor=35
    )

    # Xoá file input tạm
    os.remove(input_filename)

    # Chuyển ảnh kết quả sang dạng stream để trả về
    img_io = io.BytesIO()
    result_img.save(img_io, format="PNG")
    img_io.seek(0)

    return StreamingResponse(img_io, media_type="image/png")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)