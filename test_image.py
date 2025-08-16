import os
import warnings
from pathlib import Path

import pandas as pd

from fid.fid_score import *
from fid.inception import *
warnings.filterwarnings("ignore", category=UserWarning, module="torch.nn.functional")
warnings.filterwarnings("ignore", category=UserWarning, message='.*?retrieve source code for container of type.*?')

def inception_model(dims:int):
    block_idx = InceptionV3.BLOCK_INDEX_BY_DIM[dims]
    model = InceptionV3([block_idx])
    model.cuda()
    return model

def calculate_fid_score(render_results, bs: int, eval_size: int):
    dims = 2048
    cuda = True
    model = inception_model(dims=dims)
    rendered_paths = []
    target_paths = []

    for render_result in render_results:
        rendered_path, _, target_path = render_result
        rendered_paths.append(str(rendered_path))
        target_paths.append(str(target_path))

    rendered_m, rendered_s = calculate_activation_statistics(files=rendered_paths, model=model, batch_size=bs,
                                                             dims=dims, cuda=cuda)
    target_m, target_s = calculate_activation_statistics(files=target_paths, model=model, batch_size=bs, dims=dims,
                                                         cuda=cuda)
    fid_score = calculate_frechet_distance(rendered_m, rendered_s, target_m, target_s)
    del model
    return fid_score


def colorizer_test(colorizer, index=-1):
    test_images = [
        'data/Color_image/VIDEO3_MuiCoChay/frame_0062.jpg',
        'test_images/test1.png',
        'test_images/test2.png',
        'test_images/test3.png',
        'test_images/test4.png'
    ]

    if index == -1:
        results_dir = colorizer.results_dir
    else:
        results_dir = colorizer.results_dir / str(index)
        os.makedirs(results_dir, exist_ok=True)

    for img_path in test_images:
        colorizer.plot_transformed_image(path=img_path, results_dir=results_dir, render_factor=35)


def calculate_csv_fid(colorizer, csv_file):
    """
    Tính FID từ dữ liệu trong CSV.

    CSV phải có 2 cột: 'grayPath' (ảnh xám) và 'colorPath' (ảnh màu gốc).
    colorizer: model tô màu ảnh.
    """
    # Đọc CSV
    df = pd.read_csv(csv_file)
    if 'grayPath' not in df.columns or 'colorPath' not in df.columns:
        raise ValueError("CSV phải chứa 2 cột: 'grayPath' và 'colorPath'")

    # Tạo thư mục lưu ảnh render
    render_dir = Path("data/_critic_dataset")
    render_dir.mkdir(parents=True, exist_ok=True)

    render_results = []

    # Chạy tô màu cho từng ảnh trong CSV
    for idx, row in df.iterrows():
        gray_path = Path("data") / Path(row['grayPath'])
        color_path = Path("data") / Path(row['colorPath'])
        ext = gray_path.suffix  # lấy đuôi file như ".png", ".jpg", ...
        output_path = render_dir / f"render_{idx}{ext}"

        # Render ảnh
        result = colorizer.get_transformed_image(path=gray_path, render_factor=35)
        result.save(output_path)
        render_results.append((str(output_path), None, str(color_path)))

    # Tính FID
    fid = calculate_fid_score(render_results, bs=4, eval_size=len(render_results))
    return fid