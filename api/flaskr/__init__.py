from flask import Flask

def create_app():
    app = Flask(__name__)

    print(f"Backend is running! Name {__name__}")

    @app.route('/')
    def hello():
        return {"status": "All good I'm alive"}

    return app