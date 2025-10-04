from flask_marshmallow import Marshmallow
from marshmallow import fields, validate, ValidationError
from .models import Player, Game, Move

ma = Marshmallow()

class PlayerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Player
        load_instance = True

    name = fields.String(required=True, validate=validate.Length(min=1, max=50))
    score = fields.Integer(validate=validate.Range(min=0))

class GameSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Game
        load_instance = True

    status = fields.String(required=True, validate=validate.OneOf(["ongoing", "finished", "paused"]))

class MoveSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Move
        load_instance = True

    dice_roll = fields.Integer(required=True, validate=validate.Range(min=1, max=6))
    piece_id = fields.Integer(required=True, validate=validate.Range(min=1, max=4))
    position = fields.Integer(required=True, validate=validate.Range(min=0, max=57))  # 0=home, 1-52=board, 57=finished
    player_id = fields.Integer(required=True)
    game_id = fields.Integer(required=True)

# Schema instances
player_schema = PlayerSchema()
players_schema = PlayerSchema(many=True)

game_schema = GameSchema()
games_schema = GameSchema(many=True)

move_schema = MoveSchema()
moves_schema = MoveSchema(many=True)
