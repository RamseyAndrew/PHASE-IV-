from . import db


class Player(db.Model):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, default=0)

class Game(db.Model):
    __tablename__ = "games"
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), default="ongoing")  # ongoing, finished, etc.
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Player {self.name}>"


class Move(db.Model):
    __tablename__ = "moves"
    id = db.Column(db.Integer, primary_key=True)
    dice_roll = db.Column(db.Integer, nullable=False)
    position = db.Column(db.Integer, nullable=False)

    # Foreign keys
    player_id = db.Column(db.Integer, db.ForeignKey(
        "players.id"), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)

    # Relationships
    player = db.relationship("Player", backref="moves")
    game = db.relationship("Game", backref="moves")
