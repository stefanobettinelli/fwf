import json
import os
import unittest
from random import randint

from dotenv import load_dotenv

from constants import QUESTION_CHOICES
from flaskr import create_app
from utils import get_simplified_countries, get_game_questions

load_dotenv(".flaskenv")


class FunWithFlagsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client
        self.database_path = os.environ["DATABASE_URL"]

    def tearDown(self):
        print("tear down tests")

    def test_get_simplified_countries(self):
        with open("countries.json") as countries:
            simplified_countires = get_simplified_countries(json.load(countries))
            for simplified_country in simplified_countires:
                self.assertIn("name", simplified_country)
                self.assertTrue(simplified_country["name"])
                self.assertIn("capital", simplified_country)
                self.assertIn("region", simplified_country)
                self.assertIn("flag", simplified_country)
                self.assertTrue(simplified_country["flag"])

    def test_countries(self):
        response = self.client().get("/api/countries")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["countries"])

    def test_get_country_by_id(self):
        response_countries = self.client().get("/api/countries")
        first_country_id = json.loads(response_countries.data)["countries"][0]["id"]
        response_country = self.client().get(f"/api/countries/{first_country_id}")
        data = json.loads(response_country.data)
        self.assertEqual(response_country.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["country"])

    def test_get_questions_util(self):
        response = self.client().get("/api/countries")
        data = json.loads(response.data)
        questions = get_game_questions(data["countries"])
        for question in questions:
            self.assertEqual(3, len(question["options"]))
            correct_answer_id = question["correctAnswer"]
            response_correct_answer = self.client().get(
                f"/api/countries/{correct_answer_id}"
            )
            country_data = json.loads(response_correct_answer.data)
            self.assertEqual(response_correct_answer.status_code, 200)
            self.assertEqual(country_data["success"], True)
            self.assertTrue(country_data["country"])

    def test_get_games(self):
        response = self.client().get("/api/games")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        for game in data["games"]:
            self.assertTrue(game["questions"])
            self.assertEqual(10, len(game["questions"]))

    def test_get_question(self):
        response = self.client().get("/api/questions")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        first_question_id = data["questions"][0]["id"]
        response_single_question = self.client().get(
            f"/api/questions/{first_question_id}"
        )
        data_single_questions = json.loads(response_single_question.data)
        self.assertEqual(response_single_question.status_code, 200)
        self.assertEqual(data_single_questions["success"], True)

    def test_get_flag(self):
        data = self.test_create_game()
        question = data["questions"][0]
        response_flag = self.client().get(f"/api/questions/{question['id']}/flag")
        self.assertEqual(response_flag.status_code, 200)
        data_flag = json.loads(response_flag.data)
        self.assertEqual(data_flag["success"], True)
        self.assertTrue(data_flag["flagBase64"])

    def test_play_game(self):
        game = self.test_create_game()
        questions = game["questions"]
        for question in questions:
            random_answer_index = randint(0, QUESTION_CHOICES - 1)
            question_id = question["id"]
            response = self.client().patch(
                f"/api/questions/{question_id}",
                json={
                    "submittedAnswer": question["options"][random_answer_index]["id"]
                },
            )
            self.assertEqual(response.status_code, 200)
            answered_question_data = json.loads(response.data)
            self.assertTrue(answered_question_data["question"]["submitted_answer"])

        response_submit_game = self.client().patch(f"/api/games/{game['id']}")
        self.assertEqual(response_submit_game.status_code, 200)
        end_game_data = json.loads(response_submit_game.data)
        self.assertTrue(end_game_data["game"]["end_time"])
        self.assertTrue(0 <= end_game_data["game"]["score"] <= 10)

    def test_create_game(self):
        response = self.client().post("/api/games")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["questions"])
        self.assertEqual(10, len(data["questions"]))
        for question in data["questions"]:
            self.assertEqual(3, len(question["options"]))
        return data

    def test_delete_game(self):
        game = self.test_create_game()
        game_question_ids = [q["id"] for q in game["questions"]]
        response = self.client().delete(f"/api/games/{game['id']}")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)
        for q_id in game_question_ids:
            response_question = self.client().get(f"/api/questions/{q_id}")
            self.assertEqual(response_question.status_code, 404)

    def test_get_game(self):
        game = self.test_create_game()
        response = self.client().get(f"/api/games/{game['id']}")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
