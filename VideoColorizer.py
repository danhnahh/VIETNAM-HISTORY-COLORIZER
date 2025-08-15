#NOTE:  This must be the first call in order to work properly!
from deoldify import device
from deoldify.device_id import DeviceId
#choices:  CPU, GPU0...GPU7
device.set(device=DeviceId.GPU0)

from deoldify.visualize import *
plt.style.use('dark_background')
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message=".*?Your .*? set is empty.*?")

colorizer = get_video_colorizer()

#NOTE:  Max is 44 with 11GB video cards.  21 is a good default
#gpu khỏe thay 8 thành 21
render_factor=21
#NOTE:  Make source_url None to just read from file at ./video/source/[file_name] directly without modification
#source_url='https://twitter.com/silentmoviegifs/status/1116751583386034176'
file_name = '21285-316701418_small'
file_name_ext = file_name + '.mp4'
result_path = None

# if source_url is not None:
#     result_path = colorizer.colorize_from_url(source_url, file_name_ext, render_factor=render_factor)
# else:
result_path = colorizer.colorize_from_file_name(file_name_ext, render_factor=render_factor)

show_video_in_notebook(result_path)
