from flask import Flask, request, jsonify
import pandas as pd
import datetime
from flask_cors import CORS
import logging
import os
from werkzeug.utils import secure_filename
from menu_optimization import optimize_menu

app = Flask(__name__)
# Configure CORS to allow all origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'xlsx', 'xls'}

# High risk ingredients for demonstration
HIGH_RISK_INGREDIENTS = {
    "chicken", "beef", "fish", "eggs", "milk", "cheese", 
    "shellfish", "nuts", "peanuts", "soy", "wheat"
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST", "OPTIONS"])
def upload_file():
    if request.method == "OPTIONS":
        return "", 200
        
    logger.debug("Received upload request")
    logger.debug(f"Request headers: {dict(request.headers)}")
    
    if "file" not in request.files:
        logger.error("No file in request")
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only Excel files are allowed"}), 400

    try:
        # Save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        logger.debug(f"File saved to: {filepath}")

        # Generate dummy data
        dummy_data = {
            'date': [datetime.date.today().isoformat()] * 5,
            'ingredient': ['chicken', 'rice', 'vegetables', 'fish', 'eggs'],
            'consumption': [100, 200, 150, 80, 120]
        }
        df = pd.DataFrame(dummy_data)
        logger.debug("Generated dummy data")

        # Add high risk flag and type
        df["high_risk"] = df["ingredient"].apply(lambda x: x.lower() in HIGH_RISK_INGREDIENTS)
        df["type"] = "daily"
        
        # Convert to records
        result = df.to_dict(orient="records")
        logger.debug(f"Successfully processed {len(result)} records")
        
        return jsonify(result)

    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        return jsonify({"error": str(e)}), 400

@app.route("/optimize-menu", methods=["POST"])
def optimize_menu_endpoint():
    try:
        result = optimize_menu()
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error in optimize_menu: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001, host='0.0.0.0')
