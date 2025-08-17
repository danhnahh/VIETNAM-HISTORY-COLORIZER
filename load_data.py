# load_data.py

from fastai.vision import *

warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

# (Các class tùy chỉnh GrayImageImageList, ColorImageList vẫn giữ nguyên)
class GrayImageImageList(ImageList):
    def open(self, fn): return open_image(fn, convert_mode='RGB')


class ColorImageList(ImageList):
    def open(self, fn): return open_image(fn, convert_mode='RGB')


def get_data(bs: int, sz: int, path_dataset: Path, num_workers: int = 8, xtra_tfms=None):
    # (Hàm này không thay đổi, giữ nguyên như các phiên bản trước)
    # ...
    try:
        train_df = pd.read_csv(path_dataset / 'train.csv')
        val_df = pd.read_csv(path_dataset / 'val.csv')
    except FileNotFoundError as e:
        print(f"Lỗi: Không tìm thấy file CSV tại {path_dataset}.")
        raise e
    train_df['grayPath'] = train_df['grayPath'].apply(lambda x: path_dataset / x)
    train_df['colorPath'] = train_df['colorPath'].apply(lambda x: path_dataset / x)
    val_df['grayPath'] = val_df['grayPath'].apply(lambda x: path_dataset / x)
    val_df['colorPath'] = val_df['colorPath'].apply(lambda x: path_dataset / x)
    train_df['is_valid'] = False
    val_df['is_valid'] = True
    full_df = pd.concat([train_df, val_df], ignore_index=True)
    src = (GrayImageImageList.from_df(df=full_df, path='.', cols='grayPath')
           .split_from_df(col='is_valid')
           .label_from_df(cols='colorPath', label_cls=ColorImageList))
    tfms = get_transforms(max_zoom=1.1, max_lighting=0.5, max_warp=0.2, xtra_tfms=xtra_tfms)
    data = (src.transform(tfms, size=sz, tfm_y=True)
            .databunch(bs=bs, num_workers=num_workers, no_check=True)
            .normalize(imagenet_stats, do_y=True))
    data.path = path_dataset
    data.c = 3
    return data


# <--- HÀM ĐÃ SỬA ĐỂ TÔN TRỌNG TẬP TRAIN/VAL CÓ SẴN ---
def get_crit_data(path_crit_dataset: Path, bs: int, sz: int):
    """
    Tạo DataBunch cho Critic từ một thư mục đã có sẵn cấu trúc train/ và valid/.
    """
    classes = ['generated', 'real']

    src = (ImageList.from_folder(path_crit_dataset)
           # Đọc tập train/valid từ các thư mục con
           .split_by_folder(train='train', valid='valid')
           # Nhãn là tên thư mục con (real, generated)
           .label_from_folder(classes=classes))

    tfms = get_transforms(max_zoom=1.5,)
    data = (src.transform(tfms, size=sz)
            .databunch(bs=bs)
            .normalize(imagenet_stats))

    return data

# --- HÀM HỖ TRỢ ĐÃ SỬA LỖI XUNG ĐỘT TÊN FILE ---
def prepare_critic_data(learn_gen, data_gan, path_project_data, path_critic_dataset):
    """
    Chuẩn bị dataset cho Critic bằng cách tái tạo cấu trúc thư mục con
    để tránh xung đột tên file.
    """
    print("Đang chuẩn bị dataset cho Critic (xử lý đường dẫn lồng nhau)...")

    if path_critic_dataset.exists(): shutil.rmtree(path_critic_dataset)

    # --- ĐỊNH NGHĨA CÁC ĐƯỜNG DẪN CƠ SỞ VÀ ĐÍCH ---
    # Đường dẫn cơ sở để tính toán đường dẫn tương đối
    base_path_real_images = path_project_data / 'Color_image'

    # Các thư mục đích
    path_train_real = path_critic_dataset / 'train' / 'real'
    path_train_gen = path_critic_dataset / 'train' / 'generated'
    path_valid_real = path_critic_dataset / 'valid' / 'real'
    path_valid_gen = path_critic_dataset / 'valid' / 'generated'

    # learn_gen.model.eval()
    with torch.no_grad():
        # --- 1. XỬ LÝ TẬP TRAIN ---
        print("Tạo dữ liệu từ tập train...")
        real_paths_train = data_gan.train_ds.y.items

        i = 0
        for batch in progress_bar(data_gan.train_dl):
            fake_images = learn_gen.pred_batch(batch=batch, reconstruct=True)

            for j, fake_img in enumerate(fake_images):
                # Tạo đường dẫn lưu ảnh
                real_path_src = real_paths_train[i]
                unique_subpath = str(real_path_src.relative_to(base_path_real_images)).replace(os.sep, '_')

                dest_path_real = path_train_real / unique_subpath
                dest_path_gen = path_train_gen / unique_subpath

                dest_path_real.parent.mkdir(parents=True, exist_ok=True)
                dest_path_gen.parent.mkdir(parents=True, exist_ok=True)

                # ✅ Lưu ảnh thật từ batch[1] (target)
                real_img = Image(learn_gen.data.denorm(batch[1][j]))  # batch[1] là target ảnh thật
                real_img.save(dest_path_real)

                # ✅ Lưu ảnh tô màu từ Generator
                fake_img.save(dest_path_gen)

                i += 1

        # --- 2. XỬ LÝ TẬP VALIDATION ---
        print("Tạo dữ liệu từ tập validation...")
        real_paths_valid = data_gan.valid_ds.y.items
        i = 0
        for batch in progress_bar(data_gan.valid_dl):
            fake_images = learn_gen.pred_batch(batch=batch, reconstruct=True)

            for j, fake_img in enumerate(fake_images):
                real_path_src = real_paths_valid[i]
                unique_subpath = str(real_path_src.relative_to(base_path_real_images)).replace(os.sep, '_')

                dest_path_real = path_valid_real / unique_subpath
                dest_path_gen = path_valid_gen / unique_subpath

                dest_path_real.parent.mkdir(parents=True, exist_ok=True)
                dest_path_gen.parent.mkdir(parents=True, exist_ok=True)

                # ✅ Lưu ảnh thật từ batch[1]
                real_img = Image(learn_gen.data.denorm(batch[1][j]))
                real_img.save(dest_path_real)

                # ✅ Lưu ảnh tô màu từ Generator
                fake_img.save(dest_path_gen)

                i += 1

    print(f"Đã chuẩn bị xong dataset cho Critic tại: {path_critic_dataset}")


