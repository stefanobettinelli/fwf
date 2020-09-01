from flask import Flask, abort
from flask_migrate import Migrate
from models import db, setup_db, Country, Game, Question
from utils import get_simplified_countries, get_quiz_questions
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

    @app.route("/country/<int:country_id>")
    def get_country(country_id):
        country = Country.query.get(country_id)

        if country is None:
            abort(404)

        return {"success": True, "country": country.format()}

    @app.route("/game", methods=["POST"])
    def start_game():
        questions = get_quiz_questions(cached_countries)
        if not questions:
            return {"success": False}

        # TODO: consider persisting the game only if the user is logged in
        game = Game()
        game.insert()

        for q in questions:
            question = Question(
                options=q["options"], correct_answer=q["correctAnswer"], game_id=game.id
            )
            question.insert()
            q["id"] = question.id

        return {
            "success": True,
            "id": game.id,
            "questions": [
                {"id": question["id"], "options": question["options"]}
                for question in questions
            ],
        }

    @app.route("/questions")
    def get_questions():
        questions = Question.query.all()

        if questions is None:
            abort(404)

        return {"success": True, "questions": [q.format() for q in questions]}

    @app.errorhandler(404)
    def resource_not_found(error):
        return (
            {"success": False, "error": 404, "message": "resource not found"},
            404,
        )

    return app
