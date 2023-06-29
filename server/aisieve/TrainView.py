import logging
import os
import threading

from flask import Blueprint
from ultralytics import YOLO
from ultralytics.yolo.utils import get_settings

from aisieve.ProjectSetup import setupProject

trainview = Blueprint('trainview', __name__)


def start_training():
    try:
        datafile = os.path.join(get_settings()['datasets_dir'], 'AiSieve.yaml')

        model = YOLO("yolov8n.pt")
        model.train(data=datafile, epochs=200)  # train the model
    except Exception as e:
        logging.error(f"The training could not be completed: {e}")


@trainview.route('/train', methods=['GET'])
def train_models():
    if not setupProject():
        return 'Project setup failed', 500

    training = threading.Thread(target=start_training)
    training.start()

    return 'Started Training', 200
