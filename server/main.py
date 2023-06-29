import hashlib
import logging
import os
import uuid
from os.path import expanduser

from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
from ultralytics.yolo.utils import set_settings
from werkzeug.utils import secure_filename

from aisieve.DetectView import detectionview
from aisieve.TrainView import trainview

app = Flask(__name__)

app.register_blueprint(trainview)
app.register_blueprint(detectionview)

currentDir = os.path.dirname(os.path.realpath(__file__))

# This will enable CORS for the specific origin (http://localhost:5000)
CORS(app)


@app.route('/images', methods=['GET'])
def get_images():
    images = os.listdir(os.path.join(currentDir, 'images'))
    return jsonify(images=images)


@app.route('/image/<image>', methods=['GET'])
def get_image(image):
    # Open the file and send it to the client
    if os.path.exists(os.path.join(currentDir, 'images', image)):
        return send_file(os.path.join(currentDir, 'images', image))


@app.route('/annotations', methods=['GET'])
def get_annotations():
    annotations = os.listdir(os.path.join(currentDir, 'annotations'))
    return jsonify(annotations=annotations)


@app.route('/annotation/<annotation>', methods=['GET'])
def get_annotation(annotation):
    # Open the file and send it to the client
    if os.path.exists(os.path.join(currentDir, 'annotations', annotation)):
        return send_file(os.path.join(currentDir, 'annotations', annotation))


@app.route('/annotation', methods=['POST'])
def publish_annotation():
    if 'file' not in request.files:
        return 'No file part in the request', 400

    file = request.files['file']

    if file.filename == '':
        return 'No file selected for uploading', 400

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(currentDir, 'annotations', filename))
        logging.info(f"saved file {filename} to annotations folder")
        return 'File uploaded successfully', 200


if __name__ == '__main__':
    home = expanduser("~")
    projectDir = os.path.join(home, "aisieve-dataset")
    datasetsDir = os.path.join(projectDir, "datasets")

    set_settings({
        "datasets_dir": datasetsDir,
        "weights_dir": os.path.join(datasetsDir, "weights"),
        "runs_dir": os.path.join(datasetsDir, "runs"),
        "uuid": hashlib.sha256(str(uuid.getnode()).encode()).hexdigest(),
        "sync": True,
        "api_key": '',
        "settings_version": "0.0.3"
    })

    app.run(debug=True)
