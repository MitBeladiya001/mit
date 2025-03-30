from flask import request, jsonify
import os
import json
import logging
from werkzeug.utils import secure_filename
from datetime import datetime
from db_config import dishes_collection
import uuid

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def get_all_dishes():
    try:
        # Fetch all dishes from MongoDB
        dishes = list(dishes_collection.find())
        
        # Convert ObjectId to string for JSON serialization
        for dish in dishes:
            dish['_id'] = str(dish['_id'])
            dish['created_at'] = dish['created_at'].isoformat()
            dish['updated_at'] = dish['updated_at'].isoformat()
            
        return jsonify({
            "success": True,
            "dishes": dishes
        })
    except Exception as e:
        logger.error(f"Error fetching dishes: {str(e)}")
        return jsonify({"error": "Failed to fetch dishes"}), 500

def add_dish_endpoint():
    try:
        logger.debug("Received add-dish request")
        
        # Get form data
        name = request.form.get('name')
        price = float(request.form.get('price', 0))
        ingredients = json.loads(request.form.get('ingredients', '[]'))
        
        # Handle photo
        photo_url = request.form.get('photo_url')
        photo_file = request.files.get('photo_file')

        if not name or not price or not ingredients:
            return jsonify({"error": "Missing required fields"}), 400
            
        # Save photo if it's a file upload
        if photo_file:
            # Generate unique filename to prevent overwriting
            file_extension = os.path.splitext(photo_file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            # Save the file
            photo_file.save(filepath)
            photo_url = f"/uploads/{unique_filename}"
            
        # Create dish object with additional fields
        dish = {
            "name": name,
            "price": price,
            "ingredients": ingredients,
            "photo": photo_url,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Store in MongoDB
        try:
            result = dishes_collection.insert_one(dish)
            print(f"Dish stored in MongoDB with ID: {result.inserted_id}")
            
            # Add the MongoDB ID to the response
            dish['_id'] = str(result.inserted_id)
            
            return jsonify({
                "success": True, 
                "message": "Dish added successfully",
                "dish": dish
            })
        except Exception as db_error:
            logger.error(f"Database error: {str(db_error)}")
            return jsonify({"error": "Failed to store dish in database"}), 500
        
    except Exception as e:
        logger.error(f"Error in add-dish endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500 