from os import environ as env
from flask_migrate import Migrate
from models import db, setup_db
import requests

from flask import Flask

database_path = env["DATABASE_URL"]
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    setup_db(app)
    migrate.init_app(app, db)

    # setup cross origin
    # CORS(app)

    countries = requests.get("https://restcountries.eu/rest/v2/all")

    @app.route("/hello")
    def hello():
        return {"status": "All good I'm alive"}

    return app
