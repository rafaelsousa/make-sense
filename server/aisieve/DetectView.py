import logging
import os
import threading

from flask import Blueprint
from ultralytics import YOLO
from ultralytics.yolo.utils import get_settings

from aisieve.ProjectSetup import setupProject

detectionview = Blueprint('detectionview', __name__)


def start_detection():
    try:

        runsDir = os.path.join(get_settings()['runs_dir'], 'detect')

        listOfRuns = os.listdir(runsDir)
        listOfRuns.sort()
        latestRun = listOfRuns.pop()
        weight = os.path.join(runsDir, latestRun, 'weights', 'best.pt')

        imagesDir = os.path.join(get_settings()['datasets_dir'], 'images', 'peeble')

        model = YOLO(weight)
        model.predict(source=imagesDir, save=True, imgsz=320, conf=0.25)

    except Exception as e:
        logging.error(f"The detection could not be completed: {e}")


@detectionview.route('/detect', methods=['GET'])
def train_models():
    if not setupProject():
        return 'Project setup failed', 500

    training = threading.Thread(target=start_detection)
    training.start()

    return 'Started Prediction', 200
