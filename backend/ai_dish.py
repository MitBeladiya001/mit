from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model
try:
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
except Exception as e:
    print(f"Error initializing model: {e}")
    exit()

ai_dish_bp = Blueprint('ai_dish', __name__)

def get_surplus_ingredients():
    """Get current surplus ingredients from inventory"""
    return [
        {"name": "Chicken Breast", "quantity": 15, "expiry_date": "2024-03-25"},
        {"name": "Fresh Basil", "quantity": 8, "expiry_date": "2024-03-24"},
        {"name": "Mozzarella", "quantity": 12, "expiry_date": "2024-03-26"},
        {"name": "Tomatoes", "quantity": 20, "expiry_date": "2024-03-23"},
        {"name": "Pasta", "quantity": 10, "expiry_date": "2024-04-01"},
    ]

def generate_ai_response(prompt):
    """Generate response from Gemini API"""
    try:
        response = model.generate_content(prompt)
        content = response.text.strip()

        # Clean up JSON response
        if content.startswith('```json'):
            content = content[7:]
        if content.endswith('```'):
            content = content[:-3]

        # Parse the JSON string into a Python object
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {str(e)}")
            return {"dishes": []}
    except Exception as e:
        print(f"Error in generate_ai_response: {str(e)}")
        return {"dishes": []}

@ai_dish_bp.route('/generate-dishes', methods=['POST'])
def generate_dishes():
    try:
        data = request.get_json()
        generation_type = data.get('type')
        message = data.get('message', '')
        
        if generation_type == 'inventory':
            # Generate dishes based on current inventory
            surplus_ingredients = get_surplus_ingredients()
            prompt = f"""Create 2 creative dishes using these surplus ingredients: {surplus_ingredients}.
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
            
        elif generation_type == 'custom':
            # Generate dishes based on custom ingredients
            ingredients = data.get('ingredients', [])
            
            if not ingredients:
                return jsonify({
                    "success": False,
                    "message": "No ingredients provided"
                })
            
            prompt = f"""Create 2 creative dishes using these ingredients: {ingredients}.
            Additional requirements: {message}
            Format the response as JSON with this structure:
            {{
                "dishes": [
                    {{
                        "name": "string",
                        "description": "string",
                        "ingredients": ["string"],
                        "cost": number,
                        "recipe": "string",
                        "profit_margin": number,
                        "special_occasion": boolean
                    }}
                ]
            }}"""
        else:
            return jsonify({
                "success": False,
                "message": "Invalid generation type"
            })

        # Generate response from Gemini API
        response = generate_ai_response(prompt)
        
        if not response or "dishes" not in response:
            return jsonify({
                "success": False,
                "message": "Failed to generate dishes"
            })

        return jsonify({
            "success": True,
            "dishes": response["dishes"]
        })

    except Exception as e:
        print(f"Error in generate_dishes: {str(e)}")
        return jsonify({
            "success": False,
            "message": str(e)
        }) 