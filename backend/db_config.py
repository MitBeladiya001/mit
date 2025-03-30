from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Atlas connection string
MONGODB_URI = os.getenv('MONGODB_URI')

# Initialize MongoDB client
client = MongoClient(MONGODB_URI)

# Get database
db = client.kitchen_db

# Get collections
dishes_collection = db.dishes

# Test connection
try:
    client.server_info()
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}") 