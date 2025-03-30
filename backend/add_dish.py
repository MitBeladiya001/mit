
@app.route("/add-dish", methods=["POST"])
def add_dish():
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
            filename = secure_filename(photo_file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            photo_file.save(filepath)
            photo_url = f"/uploads/{filename}"
            
        # Create dish object
        dish = {
            "name": name,
            "price": price,
            "ingredients": ingredients,
            "photo": photo_url
        }
        
        # Here you would typically save the dish to a database
        # For now, we'll just return success
        logger.debug(f"Successfully processed dish: {dish}")
        return jsonify({"success": True, "dish": dish})
        
    except Exception as e:
        logger.error(f"Error in add-dish endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500