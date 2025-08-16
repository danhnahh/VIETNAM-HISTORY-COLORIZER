from pathlib import Path

from fastai.callbacks.tensorboard import GANTensorboardWriter
from fastai.vision.gan import GANLearner

class GANTensorboardWriterUtils(GANTensorboardWriter):
    def __init__(self, learn: GANLearner, base_dir: Path, name: str, loss_iters: int = 25, hist_iters: int = 500,
                 stats_iters: int = 100, visual_iters: int = 100):
        super().__init__(learn, base_dir, name, loss_iters, hist_iters,
                 stats_iters, visual_iters)
        self.metrics_root = 'metrics/'