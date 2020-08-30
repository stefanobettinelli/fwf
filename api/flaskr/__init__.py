from flask import Flask
from flask_migrate import Migrate
from models import db, setup_db, Country
from utils import get_simplified_countries, get_questions
from constants import REST_COUNTRIES_ALL
import requests

migrate = Migrate()

cached_countries = []


def create_app():
    app = Flask(__name__)
    setup_db(app)
    migrate.init_app(app, db)

    # setup cross origin
    # CORS(app)

    @app.before_request
    def pre_request_setup():
        global cached_countries
        if not cached_countries:
            stored_countries = [country.format() for country in Country.query.all()]
            if not stored_countries:
                countries = requests.get(REST_COUNTRIES_ALL)
                simplified_countries = get_simplified_countries(countries.json())
                Country.insert_all(simplified_countries)
                cached_countries = simplified_countries
            else:
                cached_countries = stored_countries

    @app.route("/hello")
    def hello():
        return {"status": "All good I'm alive"}

    @app.route("/countries")
    def get_countries():
        return {"success": True, "countries": cached_countries}

    @app.route("/game")
    def start_game():
        questions = get_questions(cached_countries)
        if not questions:
            return {"success": False}

        return {"success": True, "questions": questions}

    return app
