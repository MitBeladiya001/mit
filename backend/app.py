from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import datetime
from flask_cors import CORS
import logging
import os
from werkzeug.utils import secure_filename
from menu_optimization import optimize_menu
from ingredients import analyze_image_endpoint
from dishes import add_dish_endpoint, get_all_dishes
from menu import create_menu, get_all_menus, get_menu, update_menu, delete_menu
import json
from pymongo import MongoClient
import uuid
from ai_dish import ai_dish_bp, generate_ai_response

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
ALLOWED_EXTENSIONS = {'xlsx', 'xls', 'jpg', 'jpeg', 'png'}

# High risk ingredients for demonstration
HIGH_RISK_INGREDIENTS = {
    "chicken", "beef", "fish", "eggs", "milk", "cheese", 
    "shellfish", "nuts", "peanuts", "soy", "wheat"
}

# MongoDB configuration
try:
    client = MongoClient(
        os.getenv("MONGODB_URI"),
        serverSelectionTimeoutMS=5000
    )
    # Test the connection
    client.server_info()
    db = client.kitchen_db
    dishes_collection = db.dishes
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {str(e)}")
    # Fallback to local MongoDB if connection fails
    client = MongoClient(os.getenv("MONGODB_URI"))
    db = client.kitchen_db
    dishes_collection = db.dishes

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/add-dish", methods=["POST"])
def add_dish():
    return add_dish_endpoint()

@app.route("/get-dishes", methods=["GET"])
def get_dishes():
    try:
        # Fetch all dishes from MongoDB
        dishes = list(dishes_collection.find())
        
        # Convert ObjectId to string and format timestamps
        for dish in dishes:
            dish["_id"] = str(dish["_id"])
            dish["created_at"] = dish["created_at"].isoformat() if "created_at" in dish else None
            dish["updated_at"] = dish["updated_at"].isoformat() if "updated_at" in dish else None
            
            # Ensure ingredients have the correct structure
            if "ingredients" in dish:
                for ingredient in dish["ingredients"]:
                    if isinstance(ingredient, str):
                        # Convert old format to new format
                        ingredient = {
                            "name": ingredient,
                            "quantity": 1,
                            "unit": "pcs"
                        }
                    elif isinstance(ingredient, dict):
                        # Ensure all required fields exist
                        if "quantity" not in ingredient:
                            ingredient["quantity"] = 1
                        if "unit" not in ingredient:
                            ingredient["unit"] = "pcs"
        
        return jsonify({
            "success": True,
            "dishes": dishes
        })

    except Exception as e:
        logging.error(f"Error fetching dishes: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to fetch dishes",
            "error": str(e)
        }), 500

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

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    return analyze_image_endpoint()

@app.route("/menus", methods=["GET"])
def get_menus():
    return get_all_menus(db)

@app.route("/menus", methods=["POST"])
def add_menu():
    return create_menu(db)

@app.route("/menus/<menu_id>", methods=["GET"])
def get_single_menu(menu_id):
    return get_menu(db, menu_id)

@app.route("/menus/<menu_id>", methods=["PUT"])
def update_single_menu(menu_id):
    return update_menu(db, menu_id)

@app.route("/menus/<menu_id>", methods=["DELETE"])
def delete_single_menu(menu_id):
    return delete_menu(db, menu_id)

@app.route('/generate-dishes', methods=['POST'])
def generate_dishes():
    try:
        data = request.get_json()
        generation_type = data.get('type')
        
        if generation_type == 'inventory':
            # Use existing menu optimization logic
            result = optimize_menu()
            return jsonify({
                "success": True,
                "dishes": result.get("new_dishes", [])
            })
            
        elif generation_type == 'custom':
            # Handle custom ingredients
            ingredients = data.get('ingredients', [])
            message = data.get('message', '')
            
            if not ingredients:
                return jsonify({
                    "success": False,
                    "message": "No ingredients provided"
                })
            
            # Format ingredients for the AI prompt
            ingredients_text = "\n".join([f"- {ing['name']}: {ing['quantity']}" for ing in ingredients])
            
            # Generate AI response
            prompt = f"""Create 2 creative dishes using these ingredients:
            {ingredients_text}
            
            Additional requirements: {message}
            
            Format the response as JSON with this structure:
            {{
                "dishes": [
                    {{
                        "name": "string",
                        "description": "string",
                        "ingredients": ["string"],
                        "cost": number,
                        "profit_margin": number,
                        "special_occasion": boolean
                    }}
                ]
            }}"""
            
            # Use the imported generate_ai_response function
            response = generate_ai_response(prompt)
            
            if not response:
                return jsonify({
                    "success": False,
                    "message": "Failed to generate dishes"
                })
            
            return jsonify({
                "success": True,
                "dishes": response.get("dishes", [])
            })
            
        else:
            return jsonify({
                "success": False,
                "message": "Invalid generation type"
            })
            
    except Exception as e:
        print(f"Error in generate_dishes: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        })

# Register blueprints
app.register_blueprint(ai_dish_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5001, host='0.0.0.0')