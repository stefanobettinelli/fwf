import os

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from flaskr import app
from models import db

MIGRATION_DIR = os.path.join("api", "migrations")

migrate = Migrate(app, db, directory=MIGRATION_DIR)
manager = Manager(app)

manager.add_command("db", MigrateCommand)


if __name__ == "__main__":
    manager.run()
