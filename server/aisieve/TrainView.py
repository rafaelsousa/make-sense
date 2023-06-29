import os
import threading

from flask import Blueprint
from ultralytics import YOLO
from ultralytics.yolo.utils import get_settings

from aisieve.ProjectSetup import setupProject

trainview = Blueprint('trainview', __name__)


def start_training():
    model = YOLO("yolov8n.pt")

    currentPath = os.path.dirname(os.path.realpath(__file__))
    # Use the model
    datafile = os.path.join(get_settings()['datasets_dir'], 'AiSieve.yaml')
    model.train(data=datafile, epochs=3)  # train the model
    # model.export(model='best.pt', format='onnx')  # export best.pt


@trainview.route('/train', methods=['GET'])
def train_models():
    if not setupProject():
        return 'Project setup failed', 500

    training = threading.Thread(target=start_training)
    training.start()

    return 'Started Training', 200
