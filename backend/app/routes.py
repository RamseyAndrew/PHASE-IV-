from flask import Blueprint, jsonify

# Create a blueprint for API routes
api_bp = Blueprint("api", __name__)


@api_bp.route("/")
def home():
    return jsonify({"message": "Welcome to the Ludo API "})
