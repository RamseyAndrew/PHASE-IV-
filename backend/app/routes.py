
from flask import Blueprint, request, jsonify
from .models import Player, Game, Move
from .schemas import player_schema, players_schema, game_schema, games_schema, move_schema, moves_schema
from . import db
from marshmallow import ValidationError

api_bp = Blueprint("api", __name__, url_prefix="/api")

# GET all players


@api_bp.route("/players", methods=["GET"])
def get_players():
    try:
        players = Player.query.all()
        return players_schema.jsonify(players)
    except Exception as e:
        return jsonify({"error": "Failed to retrieve players"}), 500

# POST create a new player


@api_bp.route("/players", methods=["POST"])
def create_player():
    try:
        data = request.get_json()
        player = player_schema.load(data)

        # Check if player name already exists
        existing_player = Player.query.filter_by(name=player.name).first()
        if existing_player:
            return jsonify({"name": ["Player name already exists"]}), 400

        db.session.add(player)
        db.session.commit()
        return player_schema.jsonify(player), 201
    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        db.session.rollback()
        # Return the actual error message for debugging
        return jsonify({"error": "Failed to create player", "details": str(e)}), 500

@api_bp.route("/players/<int:id>", methods=["GET"])
def get_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    return player_schema.jsonify(player)


@api_bp.route("/players/<int:id>", methods=["PATCH"])
def update_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    data = request.get_json()
    try:
        updated_player = player_schema.load(data, instance=player, partial=True)
        db.session.commit()
        return player_schema.jsonify(updated_player)
    except ValidationError as err:
        return jsonify(err.messages), 400


@api_bp.route("/players/<int:id>", methods=["DELETE"])
def delete_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    db.session.delete(player)
    db.session.commit()

    return jsonify({"message": f"Player {id} deleted successfully"})


# Games routes

@api_bp.route("/games", methods=["GET"])
def get_games():
    games = Game.query.all()
    return games_schema.jsonify(games)


@api_bp.route("/games", methods=["POST"])
def create_game():
    try:
        data = request.get_json()
        game = game_schema.load(data)
        db.session.add(game)
        db.session.commit()
        return game_schema.jsonify(game), 201
    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create game"}), 500


@api_bp.route("/games/<int:id>", methods=["GET"])
def get_game(id):
    game = Game.query.get(id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    return game_schema.jsonify(game)


@api_bp.route("/games/<int:id>", methods=["PATCH"])
def update_game(id):
    game = Game.query.get(id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    data = request.get_json()
    try:
        updated_game = game_schema.load(data, instance=game, partial=True)
        db.session.commit()
        return game_schema.jsonify(updated_game)
    except ValidationError as err:
        return jsonify(err.messages), 400


@api_bp.route("/games/<int:id>", methods=["DELETE"])
def delete_game(id):
    game = Game.query.get(id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    db.session.delete(game)
    db.session.commit()

    return jsonify({"message": f"Game {id} deleted successfully"})


# Moves routes

@api_bp.route("/moves", methods=["GET"])
def get_moves():
    moves = Move.query.all()
    return moves_schema.jsonify(moves)


@api_bp.route("/games/<int:game_id>/moves", methods=["GET"])
def get_game_moves(game_id):
    moves = Move.query.filter_by(game_id=game_id).all()
    return moves_schema.jsonify(moves)


@api_bp.route("/moves", methods=["POST"])
def create_move():
    data = request.get_json()
    try:
        move = move_schema.load(data)
        # Additional validation for foreign keys
        player = Player.query.get(move.player_id)
        game = Game.query.get(move.game_id)
        if not player:
            return jsonify({"player_id": ["Player not found"]}), 400
        if not game:
            return jsonify({"game_id": ["Game not found"]}), 400

        db.session.add(move)
        db.session.commit()
        return move_schema.jsonify(move), 201
    except ValidationError as err:
        return jsonify(err.messages), 400


@api_bp.route("/moves/<int:id>", methods=["GET"])
def get_move(id):
    move = Move.query.get(id)
    if not move:
        return jsonify({"error": "Move not found"}), 404

    return move_schema.jsonify(move)


@api_bp.route("/moves/<int:id>", methods=["PATCH"])
def update_move(id):
    move = Move.query.get(id)
    if not move:
        return jsonify({"error": "Move not found"}), 404

    data = request.get_json()
    try:
        updated_move = move_schema.load(data, instance=move, partial=True)
        # Additional validation for foreign keys if they were updated
        if "player_id" in data:
            player = Player.query.get(updated_move.player_id)
            if not player:
                return jsonify({"player_id": ["Player not found"]}), 400
        if "game_id" in data:
            game = Game.query.get(updated_move.game_id)
            if not game:
                return jsonify({"game_id": ["Game not found"]}), 400

        db.session.commit()
        return move_schema.jsonify(updated_move)
    except ValidationError as err:
        return jsonify(err.messages), 400


@api_bp.route("/moves/<int:id>", methods=["DELETE"])
def delete_move(id):
    move = Move.query.get(id)
    if not move:
        return jsonify({"error": "Move not found"}), 404

    db.session.delete(move)
    db.session.commit()

    return jsonify({"message": f"Move {id} deleted successfully"})
