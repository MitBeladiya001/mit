from flask import request, jsonify
from datetime import datetime
import logging
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_menu(db):
    try:
        data = request.get_json()
        menu = {
            "name": data.get("name"),
            "description": data.get("description", ""),
            "dishes": data.get("dishes", []),  # Array of dish IDs
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = db.menus.insert_one(menu)
        menu["_id"] = str(result.inserted_id)
        
        return jsonify({
            "success": True,
            "message": "Menu created successfully",
            "menu": menu
        })
    except Exception as e:
        logger.error(f"Error creating menu: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to create menu",
            "error": str(e)
        }), 500

def get_all_menus(db):
    try:
        menus = list(db.menus.find())
        
        # Convert ObjectId to string and format timestamps
        for menu in menus:
            menu["_id"] = str(menu["_id"])
            menu["created_at"] = menu["created_at"].isoformat() if "created_at" in menu else None
            menu["updated_at"] = menu["updated_at"].isoformat() if "updated_at" in menu else None
            
            # Fetch dish details for each menu
            if "dishes" in menu:
                dish_ids = menu["dishes"]
                dishes = list(db.dishes.find({"_id": {"$in": [ObjectId(id) for id in dish_ids]}}))
                menu["dishes"] = [{
                    "_id": str(dish["_id"]),
                    "name": dish["name"],
                    "photo": dish["photo"],
                    "price": dish["price"],
                    "ingredients": dish["ingredients"]
                } for dish in dishes]
        
        return jsonify({
            "success": True,
            "menus": menus
        })
    except Exception as e:
        logger.error(f"Error fetching menus: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to fetch menus",
            "error": str(e)
        }), 500

def get_menu(db, menu_id):
    try:
        menu = db.menus.find_one({"_id": ObjectId(menu_id)})
        if not menu:
            return jsonify({
                "success": False,
                "message": "Menu not found"
            }), 404
            
        menu["_id"] = str(menu["_id"])
        menu["created_at"] = menu["created_at"].isoformat() if "created_at" in menu else None
        menu["updated_at"] = menu["updated_at"].isoformat() if "updated_at" in menu else None
        
        # Fetch dish details
        if "dishes" in menu:
            dish_ids = menu["dishes"]
            dishes = list(db.dishes.find({"_id": {"$in": [ObjectId(id) for id in dish_ids]}}))
            menu["dishes"] = [{
                "_id": str(dish["_id"]),
                "name": dish["name"],
                "photo": dish["photo"],
                "price": dish["price"],
                "ingredients": dish["ingredients"]
            } for dish in dishes]
        
        return jsonify({
            "success": True,
            "menu": menu
        })
    except Exception as e:
        logger.error(f"Error fetching menu: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to fetch menu",
            "error": str(e)
        }), 500

def update_menu(db, menu_id):
    try:
        data = request.get_json()
        update_data = {
            "name": data.get("name"),
            "description": data.get("description"),
            "dishes": data.get("dishes"),
            "updated_at": datetime.utcnow()
        }
        
        result = db.menus.update_one(
            {"_id": ObjectId(menu_id)},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({
                "success": False,
                "message": "Menu not found"
            }), 404
            
        return jsonify({
            "success": True,
            "message": "Menu updated successfully"
        })
    except Exception as e:
        logger.error(f"Error updating menu: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to update menu",
            "error": str(e)
        }), 500

def delete_menu(db, menu_id):
    try:
        result = db.menus.delete_one({"_id": ObjectId(menu_id)})
        
        if result.deleted_count == 0:
            return jsonify({
                "success": False,
                "message": "Menu not found"
            }), 404
            
        return jsonify({
            "success": True,
            "message": "Menu deleted successfully"
        })
    except Exception as e:
        logger.error(f"Error deleting menu: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to delete menu",
            "error": str(e)
        }), 500 