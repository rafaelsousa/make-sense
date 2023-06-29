import logging
import os

from ultralytics.yolo.utils import get_settings

import splitfolders


def setupProject() -> bool:
    try:
        settings = get_settings()
        datasets_dir = settings['datasets_dir']
        imagesFolder = os.path.join(datasets_dir, 'images')
        outputFolder = os.path.join(datasets_dir, 'data')
        splitfolders.ratio(imagesFolder, output=outputFolder, seed=1337, ratio=(.7, .3), group_prefix=None, move=False)
        return True
    except Exception as e:
        logging.error(f"Error while setting up project: {e}")
        return False
