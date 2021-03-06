import json
import os

from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Integer, Boolean, ARRAY, JSON, DateTime

load_dotenv(".env")

database_path = os.environ["DATABASE_URL"]
db = SQLAlchemy()


def setup_db(app, db_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = db_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # TODO: what is this?!
    db.app = app
    db.init_app(app)


class Country(db.Model):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    # TODO a display_name for internationalization should be added in the feature
    capital = Column(String, nullable=False)
    region = Column(String, nullable=False)
    flag = Column(String, nullable=False)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    # this is static as self is never referenced
    @staticmethod
    def insert_all(countries):
        db.session.add_all(
            [
                Country(
                    name=country["name"],
                    capital=country["capital"],
                    region=country["region"],
                    flag=country["flag"],
                )
                for country in countries
            ]
        )
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    # TODO: change format methods to __repr__
    def format(self):
        return {
            "id": self.id,
            "name": self.name,
            "capital": self.capital,
            "region": self.region,
            "flag": self.flag,
        }


class Question(db.Model):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    options = Column(ARRAY(JSON), nullable=False)
    correct_answer = Column(Integer, nullable=False)
    submitted_answer = Column(Integer, nullable=True)
    game_id = Column(Integer, db.ForeignKey("games.id", ondelete="CASCADE"))

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def format(self):
        return {
            "id": self.id,
            "options": [json.loads(o) for o in self.options],
            "submitted_answer": self.submitted_answer,
            "game_id": self.game.id,
        }


class Game(db.Model):
    __tablename__ = "games"
    questions = db.relationship(
        "Question",
        backref="game",
        lazy="dynamic",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    id = Column(Integer, primary_key=True)
    score = Column(Integer, nullable=False, default=0)
    start_time = db.Column(DateTime, nullable=False)
    end_time = db.Column(DateTime, nullable=True)
    user_id = db.Column(String, nullable=True)
    nickname = db.Column(String, nullable=True)
    ranked = db.Column(Boolean, nullable=True, default=False)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def format(self):
        return {
            "id": self.id,
            "score": self.score,
            "start_time": self.start_time.strftime("%m/%d/%Y, %H:%M:%S")
            if self.start_time
            else "",
            "end_time": self.end_time.strftime("%m/%d/%Y, %H:%M:%S")
            if self.end_time
            else "",
        }
