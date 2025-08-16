# train.py

# fastai và deoldify
from deoldify import device
from deoldify.device_id import DeviceId
#choices:  CPU, GPU0...GPU7
device.set(device=DeviceId.GPU0)

# fastai và deoldify
import fastai
from deoldify.visualize import get_stable_image_colorizer
from Utils_Lib import GANTensorboardWriterUtils
from fastai.vision import *
from fastai.callbacks import *
from fastai.vision.gan import *
from deoldify.generators import *
from deoldify.critics import *
from deoldify.loss import *

# Import các hàm từ load_data.py
from load_data import get_data, get_crit_data, prepare_critic_data
from test_image import colorizer_test, calculate_csv_fid

# --- CẤU HÌNH ĐƯỜNG DẪN ---
PATH_CENTRAL_MODELS = Path('.')
PATH_PROJECT_DATA = Path('./data')
PATH_CRITIC_DATASET = PATH_PROJECT_DATA / '_critic_dataset'
MODEL_TYPE = 'Stable'
TENSORBOARD_PATH = Path('data/tensorboard/' + MODEL_TYPE)
FID_PATH = Path('data/fid/' + MODEL_TYPE)

# --- CÁC THAM SỐ HUẤN LUYỆN ---
SZ = 192
BS = 8
TOTAL_GAN_EPOCHS = 10
CRITIC_EPOCHS_PER_CYCLE = 4
GAN_EPOCHS_PER_CYCLE = 1
LR_CRITIC = 1e-5
LR_GAN = 2e-4

# --- QUY TRÌNH HUẤN LUYỆN CHÍNH ---
if __name__ == '__main__':
    # ... (Phần cài đặt device không đổi)
    device.set(device=DeviceId.GPU0 if torch.cuda.is_available() else DeviceId.CPU)
    print(f'Using: {"GPU" if torch.cuda.is_available() else "CPU"}')

    # --- LOAD DỮ LIỆU CHÍNH ---
    print("Đang tải dữ liệu chính (cho Generator và GAN)...")
    data_gan = get_data(bs=BS, sz=SZ, path_dataset=PATH_PROJECT_DATA)

    # Tạo đường dẫn đầy đủ đến các file pre-trained
    path_pretrained_gen = PATH_CENTRAL_MODELS / f'Colorize{MODEL_TYPE}_gen'
    path_pretrained_crit = PATH_CENTRAL_MODELS / f'Colorize{MODEL_TYPE}_crit'

    fid_scores = []

    # --- BẮT ĐẦU VÒNG LẶP HUẤN LUYỆN CHU KỲ ---
    num_cycles = TOTAL_GAN_EPOCHS // GAN_EPOCHS_PER_CYCLE
    for cycle in range(num_cycles):
        print('\n' + '=' * 50)
        print(f'BẮT ĐẦU CHU KỲ SỐ: {cycle + 1}/{num_cycles}')
        print('=' * 50)

        # --- BƯỚC 1: TRAIN RIÊNG CRITIC ---
        print("\n--- Bước 1: Huấn luyện Critic ---")
        # --- KHỞI TẠO GENERATOR VÀ LOAD MODEL ---
        print("Đang khởi tạo generator và tải model pre-trained...")
        learn_gen = gen_learner_wide(data=data_gan, gen_loss=FeatureLoss(), nf_factor=2)
        if cycle == 0:
            learn_gen.path = PATH_CENTRAL_MODELS
            learn_gen.load(path_pretrained_gen, with_opt=False)
            learn_gen.path = PATH_PROJECT_DATA
        else:
            learn_gen.load(path_pretrained_gen, with_opt=False)

        # 1A: Chuẩn bị dataset cho critic (đã bao gồm cả train và val)
        prepare_critic_data(learn_gen, data_gan, PATH_PROJECT_DATA, PATH_CRITIC_DATASET)

        # 1B: Load dataset đó bằng hàm mới
        data_crit = get_crit_data(PATH_CRITIC_DATASET, bs=16, sz=SZ)

        # 1C: Tạo learner cho critic và train
        learn_crit = colorize_crit_learner(data=data_crit, nf=256)
        learn_crit.path = PATH_CENTRAL_MODELS
        learn_crit.load(path_pretrained_crit, with_opt=False)

        if cycle == 0:
            learn_crit.path = PATH_CENTRAL_MODELS
            learn_crit.load(path_pretrained_crit, with_opt=False)
        else:
            learn_crit.path = PATH_PROJECT_DATA
            learn_crit.load(path_pretrained_crit, with_opt=False)

        learn_crit.path = PATH_CRITIC_DATASET

        print(f"Fine-tuning Critic trong {CRITIC_EPOCHS_PER_CYCLE} epochs...")
        learn_crit.fit_one_cycle(CRITIC_EPOCHS_PER_CYCLE, LR_CRITIC)
        learn_crit.save(f'Colorize{MODEL_TYPE}_crit')
        gc.collect()

        learn_crit = colorize_crit_learner(data=data_crit, nf=256).load(path_pretrained_crit, with_opt=False)
        # --- BƯỚC 2: TRAIN TOÀN BỘ HỆ THỐNG GAN ---
        print("\n--- Bước 2: Huấn luyện GAN ---")
        switcher = partial(AdaptiveGANSwitcher, critic_thresh=0.65)
        learn = GANLearner.from_learners(learn_gen, learn_crit, weights_gen=(1.0, 1.5), show_img=False,
                                         switcher=switcher,
                                         opt_func=partial(optim.Adam, betas=(0., 0.9)), wd=1e-3)
        learn.callback_fns.append(partial(GANDiscriminativeLR, mult_lr=5.))
        learn.callback_fns.append(
            partial(GANTensorboardWriterUtils, base_dir=TENSORBOARD_PATH, name='GanLearner', visual_iters=100,
                    stats_iters=10, loss_iters=1))

        print(f"Huấn luyện GAN trong {GAN_EPOCHS_PER_CYCLE} epoch...")
        learn_gen.freeze_to(-1)
        learn.fit(GAN_EPOCHS_PER_CYCLE, LR_GAN)

        learn_crit.path = PATH_PROJECT_DATA
        learn_gen.save(f'Colorize{MODEL_TYPE}_gen')
        learn_crit.save(f'Colorize{MODEL_TYPE}_crit')

        # Dự đoán ảnh
        colorizer = get_stable_image_colorizer(root_folder=Path('data'))
        colorizer_test(colorizer, index=cycle)
        fid_scores.append(calculate_csv_fid(colorizer, "data/val.csv"))

        gc.collect()

    # --- LƯU MODEL CUỐI CÙNG ---
    os.makedirs(FID_PATH, exist_ok=True)
    with open(FID_PATH / "fid.txt", "w") as f:
        for fid in fid_scores:
            f.write(f"{fid}\n")
    print("\n" + "=" * 50)
    print("ĐÃ HOÀN TẤT HUẤN LUYỆN")