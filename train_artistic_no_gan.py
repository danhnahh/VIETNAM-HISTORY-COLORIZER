from deoldify import device
from deoldify.device_id import DeviceId

# Chọn thiết bị: CPU, GPU0...GPU7
device.set(device=DeviceId.GPU0)

# fastai và deoldify
import fastai
from deoldify.generators import *
from deoldify.loss import FeatureLoss
from deoldify.visualize import get_artistic_image_colorizer
from fastai.vision import *
from fastai.callbacks import *

# Import từ load_data.py
from load_data import get_data
from test_image import colorizer_test

from pathlib import Path
import gc

# --- CẤU HÌNH ---
PATH_CENTRAL_MODELS = Path('.')
PATH_PROJECT_DATA = Path('./data')
MODEL_TYPE = 'Artistic'
SZ = 256
BS = 7
LR = 1e-4
EPOCHS = 10   # Có thể tăng lên nếu cần

if __name__ == '__main__':
    print(f'Using: {"GPU"}')

    # Load dữ liệu
    print("Đang tải dữ liệu cho Generator...")
    data_gen = get_data(bs=BS, sz=SZ, path_dataset=PATH_PROJECT_DATA)

    # Load generator pre-trained
    learn_gen = gen_learner_deep(data=data_gen, gen_loss=FeatureLoss(), nf_factor=1.5)
    learn_gen.path = PATH_CENTRAL_MODELS
    learn_gen.load(f'Colorize{MODEL_TYPE}_gen', with_opt=False)

    # Đặt path mới để lưu model fine-tune
    learn_gen.path = PATH_PROJECT_DATA

    # Fine-tune generator (không GAN)
    print(f"Fine-tuning Generator trong {EPOCHS} epochs (NoGAN)...")
    # Giai đoạn 1: đóng băng encoder
    learn_gen.freeze()
    learn_gen.fit_one_cycle(3, 1e-4)

    # Giai đoạn 2: mở dần layer cuối của encoder
    learn_gen.freeze_to(-2)
    learn_gen.fit_one_cycle(5, 5e-5)

    # Giai đoạn 3 (tuỳ chọn): mở toàn bộ
    learn_gen.unfreeze()
    learn_gen.fit_one_cycle(3, 1e-5)

    # Lưu model đã fine-tune
    learn_gen.save(f'Colorize{MODEL_TYPE}_gen')

    # Test dự đoán ảnh
    colorizer = get_artistic_image_colorizer(root_folder=Path('data'))
    colorizer_test(colorizer)

    gc.collect()
