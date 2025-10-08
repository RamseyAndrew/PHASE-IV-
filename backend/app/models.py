from . import db
from datetime import datetime
import bcrypt


class Player(db.Model):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """Hash and set the password"""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(
            password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        """Check if provided password matches the hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def __repr__(self):
        return "<Player %r - %r>" % (self.id, self.name)


class Game(db.Model):
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), default="ongoing")
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return "<Game %r - %r>" % (self.id, self.status)


class Move(db.Model):
    __tablename__ = "moves"

    id = db.Column(db.Integer, primary_key=True)
    dice_roll = db.Column(db.Integer, nullable=False)
    piece_id = db.Column(db.Integer, nullable=False)
    position = db.Column(db.Integer, nullable=False)

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
