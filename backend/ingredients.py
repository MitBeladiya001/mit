from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import random

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Dummy ingredients for different food types
DUMMY_INGREDIENTS = {
    "pizza": ["Flour", "Tomato Sauce", "Mozzarella", "Olive Oil", "Basil"],
    "pasta": ["Pasta", "Tomato Sauce", "Parmesan", "Olive Oil", "Garlic"],
    "salad": ["Lettuce", "Tomato", "Cucumber", "Olive Oil", "Vinegar"],
    "burger": ["Beef Patty", "Bun", "Lettuce", "Tomato", "Cheese", "Ketchup"],
    "taco": ["Tortilla", "Ground Beef", "Lettuce", "Cheese", "Salsa"],
    "sushi": ["Rice", "Seaweed", "Fish", "Wasabi", "Soy Sauce"],
    "soup": ["Broth", "Vegetables", "Salt", "Herbs", "Onion"],
    "steak": ["Beef", "Salt", "Pepper", "Butter", "Garlic"],
    "cake": ["Flour", "Sugar", "Eggs", "Butter", "Vanilla"],
    "sandwich": ["Bread", "Cheese", "Ham", "Lettuce", "Tomato"],
}

def get_dummy_ingredients():
    # Randomly select a food type
    food_type = random.choice(list(DUMMY_INGREDIENTS.keys()))
    ingredients = DUMMY_INGREDIENTS[food_type]
    
    # Add 2-3 random ingredients from other food types
    other_food_types = random.sample(list(DUMMY_INGREDIENTS.keys()), 3)
    for food in other_food_types:
        if food != food_type:
            random_ingredient = random.choice(DUMMY_INGREDIENTS[food])
            ingredients.append(random_ingredient)
    
    # Remove duplicates and sort
    return sorted(list(set(ingredients)))

def analyze_image(image_data):
    try:
        # Simulate processing time
        import time
        time.sleep(1)
        
        # Return dummy ingredients
        return get_dummy_ingredients()

    except Exception as e:
        logger.error(f"Error analyzing image: {e}")
        return ["Ingredient 1", "Ingredient 2", "Ingredient 3"]

def analyze_image_endpoint():
    try:
        if 'image_file' in request.files:
            image_file = request.files['image_file']
            ingredients = analyze_image(image_file)
        elif 'image_url' in request.form:
            image_url = request.form['image_url']
            ingredients = analyze_image(image_url)
        else:
            return jsonify({"error": "No image provided"}), 400

        return jsonify({"ingredients": ingredients})

    except Exception as e:
        logger.error(f"Error in analyze-image endpoint: {e}")
        return jsonify({
            "error": "Failed to analyze image",
            "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"]
        }), 500