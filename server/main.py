import os

from flask import Flask, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)

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


if __name__ == '__main__':
    app.run(debug=True)
