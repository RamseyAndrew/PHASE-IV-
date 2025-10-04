from . import db


class Player(db.Model):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, default=0)

    def __repr__(self):
        return "<Player %r - %r>" % (self.id, self.name)


class Game(db.Model):
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True)
    # ongoing, finished, etc.
    status = db.Column(db.String(20), default="ongoing")
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return "<Game %r - %r>" % (self.id, self.status)


class Move(db.Model):
    __tablename__ = "moves"

    id = db.Column(db.Integer, primary_key=True)
    dice_roll = db.Column(db.Integer, nullable=False)
    piece_id = db.Column(db.Integer, nullable=False)  # 1-4 for each player's pieces
    position = db.Column(db.Integer, nullable=False)  # 0 = home, 1-52 = board positions, 57 = finished

    # Foreign keys
    player_id = db.Column(db.Integer, db.ForeignKey(
        "players.id"), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey("games.id"), nullable=False)

    # Relationships
    player = db.relationship("Player", backref="moves")
    game = db.relationship("Game", backref="moves")

    def __repr__(self):
        return "<Move %r - Player %r, Game %r, Roll %r>" % (
            self.id, self.player_id, self.game_id, self.dice_roll
        )
