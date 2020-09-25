import base64
from datetime import datetime

import requests
from flask import Flask, abort, request

from auth import AuthError, requires_auth
from constants import REST_COUNTRIES_ALL
from models import db, setup_db, Country, Game, Question
from utils import get_simplified_countries, get_game_questions

cached_countries = []


def create_app():
    app = Flask(__name__, static_folder="../../build", static_url_path="/")
    setup_db(app)

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

    @app.route("/")
    def index():
        return app.send_static_file("index.html")

    @app.route("/api/hello")
    def hello():
        if cached_countries is None:
            return {
                "success": False,
                "status": "Countries Error",
            }  # TODO: provide a better msg solution
        return {"success": True, "status": "All good I'm alive"}

    @app.route("/api/countries")
    def get_countries():
        if cached_countries is None:
            return {"success": False}
        return {"success": True, "countries": cached_countries}

    @app.route("/api/countries/<int:country_id>")
    def get_country(country_id):
        country = Country.query.get(country_id)

        if country is None:
            abort(404)

        return {"success": True, "country": country.format()}

    @app.route("/api/games/<int:game_id>")
    def get_game(game_id):
        game = Game.query.get(game_id)

        if game is None:
            abort(404)

        return {"success": True, "game": game.format()}

    @app.route("/api/games", methods=["POST"])
    def start_game():
        generated_questions = get_game_questions(cached_countries)
        if not generated_questions:
            return {"success": False}

        start_time = datetime.now()
        game = Game(start_time=start_time)
        game.insert()

        questions = []
        for q in generated_questions:
            question = Question(
                options=q["options"],
                correct_answer=q["correctAnswer"],
                game_id=game.id,
            )
            question.insert()
            questions.append(question)

        return {
            "success": True,
            "id": game.id,
            "questions": [question.format() for question in questions],
        }

    @app.route("/api/games/ranked", methods=["POST"])
    @requires_auth("post:ranked-games")
    def start_ranked_game(jwt):
        generated_questions = get_game_questions(cached_countries)
        if not generated_questions:
            return {"success": False}

        data = request.get_json()
        user_id = data["userId"]
        start_time = datetime.now()
        game = Game(start_time=start_time, ranked=True, user_id=user_id)
        game.insert()

        questions = []
        for q in generated_questions:
            question = Question(
                options=q["options"],
                correct_answer=q["correctAnswer"],
                game_id=game.id,
            )
            question.insert()
            questions.append(question)

        return {
            "success": True,
            "id": game.id,
            "questions": [question.format() for question in questions],
        }

    @app.route("/api/games/<int:game_id>", methods=["DELETE"])
    def delete_game(game_id):
        game = Game.query.get(game_id)

        if game is None:
            abort(404)

        game.delete()

        return {"success": True}

    @app.route("/api/games/<int:game_id>", methods=["PATCH"])
    def end_game(game_id):
        game = Game.query.get(game_id)

        if game is None:
            abort(404)

        game.end_time = datetime.now()
        score = 0
        for q in game.questions.all():
            if q.submitted_answer == q.correct_answer:
                score += 1
        game.score = score
        game.update()

        return {"success": True, "game": game.format()}

    @app.route("/api/games")
    def get_games():
        games = Game.query.all()
        data = [
            {"id": g.id, "questions": [q.format() for q in g.questions.all()]}
            for g in games
        ]

        if games is None:
            abort(404)

        return {"success": True, "games": data}

    @app.route("/api/questions")
    def get_questions():
        questions = Question.query.all()

        if questions is None:
            abort(404)

        return {"success": True, "questions": [q.format() for q in questions]}

    @app.route("/api/questions/<int:question_id>")
    def get_question(question_id):
        question = Question.query.get(question_id)

        if question is None:
            abort(404)

        return {"success": True, "question": question.format()}

    @app.route("/api/questions/<int:question_id>/flag")
    def get_question_flag(question_id):
        question = Question.query.get(question_id)

        if question is None:
            abort(404)

        country = Country.query.get(question.correct_answer)

        if country is None:
            abort(404)

        flag_url = country.flag
        flag_b64 = base64.b64encode(flag_url.encode("utf-8"))

        return {"success": True, "flagBase64": flag_b64.decode("utf-8")}

    @app.route("/api/questions/<int:question_id>", methods=["PATCH"])
    def answer_to_question(question_id):
        question = Question.query.get(question_id)

        if question is None:
            abort(404)

        data = request.get_json()
        question.submitted_answer = data["submittedAnswer"]
        question.update()

        return {"success": True, "question": question.format()}

    @app.errorhandler(404)
    def resource_not_found(error):
        return (
            {"success": False, "error": 404, "message": "resource not found"},
            404,
        )

    @app.errorhandler(AuthError)
    def handle_auth_error(exception):
        response = exception.error
        response.status_code = exception.status_code
        return response

    return app


app = create_app()

if __name__ == "__main__":
    app.run()
