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

@api_bp.route("/players/<int:id>", methods=["GET"])
def get_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    return jsonify({"id": player.id, "name": player.name, "score": player.score})


@api_bp.route("/players/<int:id>", methods=["PATCH"])
def update_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    data = request.get_json()
    if "name" in data:
        player.name = data["name"]
    if "score" in data:
        player.score = data["score"]

    db.session.commit()

    return jsonify({"id": player.id, "name": player.name, "score": player.score})


@api_bp.route("/players/<int:id>", methods=["DELETE"])
def delete_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    db.session.delete(player)
    db.session.commit()

    return jsonify({"message": f"Player {id} deleted successfully"})
