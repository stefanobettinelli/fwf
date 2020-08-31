import os

from sqlalchemy import Column, String, Integer, ARRAY
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv(".flaskenv")

database_path = os.environ["DATABASE_URL"]
db = SQLAlchemy()


def setup_db(app, db_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = db_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # TODO: what is this?!
    db.app = app
    db.init_app(app)


# TODO check if this is important
# try:
#     todo = Todo(description=description)
#     db.session.add(todo)
#     db.session.commit()
# except:
#     db.session.rollback()
#     error = True
#     print(sys.exc_info())
# finally:
#     db.session.close()


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


class Game(db.Model):
    __tablename__ = "games"
    questions = db.relationship("Question", lazy="dynamic")

    id = Column(Integer, primary_key=True)

    def insert(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def format(self):
        return {"id": self.id}


class Question(db.Model):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    options = Column(ARRAY(String), nullable=False)
    correct_answer = Column(Integer, nullable=False)
    submitted_answer = Column(Integer, nullable=True)
    game_id = Column(Integer, db.ForeignKey("games.id"))

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
            "options": self.options,
            "correct_answer": self.correct_answer,
            "submitted_answer": self.submitted_answer,
        }
