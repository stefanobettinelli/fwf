import os

from sqlalchemy import Column, String, Integer
from flask_sqlalchemy import SQLAlchemy

database_path = os.environ.get("DATABASE_URL", "no DB in env")
db = SQLAlchemy()


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
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
    capital = Column(String, nullable=False)
    region = Column(String, nullable=False)
    flag = Column(String, nullable=False)

    def insert(self):
        db.session.add()
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
        db.session.delete()
        db.session.commit()

    def update(self):
        db.session.commit()

    def format(self):
        return {
            "id": self.id,
            "name": self.name,
            "capital": self.capital,
            "region": self.region,
            "flag": self.flag,
        }
