from flask import Blueprint, request, jsonify
from .models import Player, Game, Move
from .schemas import player_schema, players_schema, game_schema, games_schema, move_schema, moves_schema
from . import db
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity

api_bp = Blueprint("api", __name__, url_prefix="/api")

# GET all players (PUBLIC - no auth needed)


@api_bp.route("/players", methods=["GET"])
def get_players():
    try:
        players = Player.query.all()
        return players_schema.jsonify(players)
    except Exception:
        return jsonify({"error": "Failed to retrieve players"}), 500


# GET single player (PUBLIC)
@api_bp.route("/players/<int:id>", methods=["GET"])
def get_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404
    return player_schema.jsonify(player)


# UPDATE player (PROTECTED - must be logged in)
@api_bp.route("/players/<int:id>", methods=["PATCH"])
@jwt_required()
def update_player(id):
    current_user_id = get_jwt_identity()

    # Users can only update their own profile
    if current_user_id != id:
        return jsonify({"error": "Unauthorized to update this player"}), 403

    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    data = request.get_json()

    # Prevent updating sensitive fields
    if 'password_hash' in data:
        del data['password_hash']
    if 'id' in data:
        del data['id']

    try:
        updated_player = player_schema.load(
            data, instance=player, partial=True)
        db.session.commit()
        return player_schema.jsonify(updated_player)
    except ValidationError as err:
        return jsonify(err.messages), 400


# DELETE player (PROTECTED)
@api_bp.route("/players/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_player(id):
    current_user_id = get_jwt_identity()

    # Users can only delete their own account
    if current_user_id != id:
        return jsonify({"error": "Unauthorized to delete this player"}), 403

    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404

    # Delete all moves related to this player first
    moves = Move.query.filter_by(player_id=id).all()
    for move in moves:
        db.session.delete(move)

    db.session.delete(player)
    db.session.commit()

    return jsonify({"message": f"Player {id} deleted successfully"})


# ===== GAME ROUTES =====

@api_bp.route("/games", methods=["GET"])
def get_games():
    try:
        games = Game.query.all()
        return games_schema.jsonify(games)
    except Exception:
        return jsonify({"error": "Failed to retrieve games"}), 500


@api_bp.route("/games", methods=["POST"])
@jwt_required()  # Must be logged in to create game
def create_game():
    try:
        data = request.get_json()
        game = game_schema.load(data)
        db.session.add(game)
        db.session.commit()
        return game_schema.jsonify(game), 201
    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to create game"}), 500


@api_bp.route("/games/<int:id>", methods=["GET"])
def get_game(id):
    game = Game.query.get(id)
    if not game:
        return jsonify({"error": "Game not found"}), 404
    return game_schema.jsonify(game)


@api_bp.route("/games/<int:id>", methods=["PATCH"])
@jwt_required()  # Must be logged in to update game
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
@jwt_required()  # Must be logged in to delete game
def delete_game(id):
    game = Game.query.get(id)
    if not game:
        return jsonify({"error": "Game not found"}), 404

    # Delete all moves related to this game first
    moves = Move.query.filter_by(game_id=id).all()
    for move in moves:
        db.session.delete(move)

    db.session.delete(game)
    db.session.commit()

    return jsonify({"message": f"Game {id} deleted successfully"})


# ===== MOVE ROUTES =====

@api_bp.route("/moves", methods=["GET"])
def get_moves():
    try:
        moves = Move.query.all()
        return moves_schema.jsonify(moves)
    except Exception:
        return jsonify({"error": "Failed to retrieve moves"}), 500


@api_bp.route("/games/<int:game_id>/moves", methods=["GET"])
def get_game_moves(game_id):
    moves = Move.query.filter_by(game_id=game_id).all()
    return moves_schema.jsonify(moves)


@api_bp.route("/moves", methods=["POST"])
@jwt_required()  # Must be logged in to create move
def create_move():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    try:
        move = move_schema.load(data)

        # Verify the move belongs to the current user
        if move.player_id != current_user_id:
            return jsonify({"error": "You can only create moves for your own player"}), 403

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
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Failed to create move"}), 500


@api_bp.route("/moves/<int:id>", methods=["GET"])
def get_move(id):
    move = Move.query.get(id)
    if not move:
        return jsonify({"error": "Move not found"}), 404
    return move_schema.jsonify(move)


@api_bp.route("/moves/<int:id>", methods=["PATCH"])
@jwt_required()
def update_move(id):
    current_user_id = get_jwt_identity()
    move = Move.query.get(id)

    if not move:
        return jsonify({"error": "Move not found"}), 404

    # Users can only update their own moves
    if move.player_id != current_user_id:
        return jsonify({"error": "Unauthorized to update this move"}), 403

    data = request.get_json()
    try:
        updated_move = move_schema.load(data, instance=move, partial=True)
        db.session.commit()
        return move_schema.jsonify(updated_move)
    except ValidationError as err:
        return jsonify(err.messages), 400


@api_bp.route("/moves/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_move(id):
    current_user_id = get_jwt_identity()
    move = Move.query.get(id)

    if not move:
        return jsonify({"error": "Move not found"}), 404

    # Users can only delete their own moves
    if move.player_id != current_user_id:
        return jsonify({"error": "Unauthorized to delete this move"}), 403

    db.session.delete(move)
    db.session.commit()

    return jsonify({"message": f"Move {id} deleted successfully"})
