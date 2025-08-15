#NOTE:  This must be the first call in order to work properly!
from matplotlib import pyplot as plt

from deoldify import device
from deoldify.device_id import DeviceId
#choices:  CPU, GPU0...GPU7
device.set(device=DeviceId.GPU0)
from deoldify.visualize import *
plt.style.use('dark_background')
torch.backends.cudnn.benchmark=True
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message=".*?Your .*? set is empty.*?")
colorizer = get_image_colorizer(artistic=False)
#NOTE:  Max is 45 with 11GB video cards. 35 is a good default
render_factor=45
#NOTE:  Make source_url None to just read from file at ./video/source/[file_name] directly without modification
#source_url='https://upload.wikimedia.org/wikipedia/commons/e/e4/Raceland_Louisiana_Beer_Drinkers_Russell_Lee.jpg'
source_path = 'test_images/Anh-anime-khong-co-mau.jpg'
result_path = None

# if source_url is not None:
#     result_path = colorizer.plot_transformed_image_from_url(url=source_url, path=source_path, render_factor=render_factor, compare=True)
# else:
#     result_path = colorizer.plot_transformed_image(path=source_path, render_factor=render_factor, compare=True)
result_path = colorizer.plot_transformed_image(path=source_path, render_factor=render_factor, compare=True)
show_image_in_notebook(result_path)
#for i in range(10,46):
    #colorizer.plot_transformed_image(source_path, render_factor=i, display_render_factor=True, figsize=(10,10))