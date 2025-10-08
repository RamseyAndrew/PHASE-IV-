from flask import Blueprint, request, jsonify
from .models import Player
from . import db
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
import re

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Email validation regex
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'


def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, "Valid"


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new player"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get("name"):
            return jsonify({"error": "Username is required"}), 400
        if not data.get("password"):
            return jsonify({"error": "Password is required"}), 400

        name = data.get("name").strip()
        email = data.get("email", "").strip() if data.get("email") else None
        password = data.get("password")

        # Validate username length
        if len(name) < 3:
            return jsonify({"error": "Username must be at least 3 characters long"}), 400
        if len(name) > 50:
            return jsonify({"error": "Username must be less than 50 characters"}), 400

        # Validate email if provided
        if email and not re.match(EMAIL_REGEX, email):
            return jsonify({"error": "Invalid email format"}), 400

        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({"error": message}), 400

        # Check if username already exists
        existing_user = Player.query.filter_by(name=name).first()
        if existing_user:
            return jsonify({"error": "Username already exists"}), 409

        # Check if email already exists (if provided)
        if email:
            existing_email = Player.query.filter_by(email=email).first()
            if existing_email:
                return jsonify({"error": "Email already registered"}), 409

        # Create new player
        new_player = Player(name=name, email=email)
        new_player.set_password(password)

        db.session.add(new_player)
        db.session.commit()

        # Create access token
        access_token = create_access_token(identity=new_player.id)
        refresh_token = create_refresh_token(identity=new_player.id)

        return jsonify({
            "message": "Player registered successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "player": {
                "id": new_player.id,
                "name": new_player.name,
                "email": new_player.email,
                "score": new_player.score
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login an existing player"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get("name"):
            return jsonify({"error": "Username is required"}), 400
        if not data.get("password"):
            return jsonify({"error": "Password is required"}), 400

        name = data.get("name").strip()
        password = data.get("password")

        # Find player by username
        player = Player.query.filter_by(name=name).first()

        if not player:
            return jsonify({"error": "Invalid username or password"}), 401

        # Check password
        if not player.check_password(password):
            return jsonify({"error": "Invalid username or password"}), 401

        # Create tokens
        access_token = create_access_token(identity=player.id)
        refresh_token = create_refresh_token(identity=player.id)

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "player": {
                "id": player.id,
                "name": player.name,
                "email": player.email,
                "score": player.score
            }
        }), 200

    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    try:
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)

        return jsonify({
            "access_token": new_access_token
        }), 200

    except Exception as e:
        return jsonify({"error": f"Token refresh failed: {str(e)}"}), 500


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    """Get current logged in user info"""
    try:
        current_user_id = get_jwt_identity()
        player = Player.query.get(current_user_id)

        if not player:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "player": {
                "id": player.id,
                "name": player.name,
                "email": player.email,
                "score": player.score,
                "created_at": player.created_at.isoformat()
            }
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to get user info: {str(e)}"}), 500


@auth_bp.route("/check-username", methods=["POST"])
def check_username():
    """Check if username is available"""
    try:
        data = request.get_json()
        name = data.get("name", "").strip()

        if not name:
            return jsonify({"available": False, "error": "Username is required"}), 400

        existing_user = Player.query.filter_by(name=name).first()

        return jsonify({
            "available": existing_user is None
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
