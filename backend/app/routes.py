from flask import Blueprint, request, jsonify
from .models import Player
from . import db

api_bp = Blueprint("api", __name__, url_prefix="/api")

# GET all players


@api_bp.route("/players", methods=["GET"])
def get_players():
    players = Player.query.all()
    return jsonify([{"id": p.id, "name": p.name, "score": p.score} for p in players])

# POST create a new player


@api_bp.route("/players", methods=["POST"])
def create_player():
    data = request.get_json()
    name = data.get("name")
    score = data.get("score", 0)

    if not name:
        return jsonify({"error": "Name is required"}), 400

    new_player = Player(name=name, score=score)
    db.session.add(new_player)
    db.session.commit()

    return jsonify({"id": new_player.id, "name": new_player.name, "score": new_player.score}), 201
