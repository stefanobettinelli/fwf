import json
import os
import unittest
from random import randint

from dotenv import load_dotenv

from constants import QUESTION_CHOICES
from flaskr import create_app
from utils import get_simplified_countries, get_game_questions

load_dotenv(".env")

ADMIN_JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBybFdlQU9FYS1rNWFxbmdZUmRwZCJ9.eyJpc3MiOiJodHRwczovL2ZzbmQtc3RlZi5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWY2NWU2ZDI3ZTFhMTMwMDY5MTY3NDQ2IiwiYXVkIjpbImh0dHBzOi8vZmxhZ3NhcmVmdW4uaGVyb2t1YXBwLmNvbS9hcGkvIiwiaHR0cHM6Ly9mc25kLXN0ZWYuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwMTIyNzEyMywiZXhwIjoxNjAxMzEzNTIzLCJhenAiOiJMM043bTV2YXRyVjJQb3hIc05CWklJMFlaanlhMlBReSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgcG9zdDpyYW5rZWQtZ2FtZXMiLCJwZXJtaXNzaW9ucyI6WyJkZWxldGU6Z2FtZXMiLCJwb3N0OnJhbmtlZC1nYW1lcyJdfQ.nLj0XkbJtnNgdT-WObFCRhAiuMwjzx-Hjb-cmujZeZZyKbn4aaZ-LZ6_H44p0wbOZdjyHqXERRM_vCKtdpv40RHdrSOcaGxPyWPpTvKGoxvVSbUKCiKWLUsQR9junfd3FbcII1pqyTFycFc2gPASUnA5gpOzwbnzAveygcV8bhrUU5F4qwtzgxcH_J8kwxU5xDKP0AKjZbWb_NaRpWMvS2ixehrzahHgjxn_aiVlOaz_pgqZZKA4BxU_zU9yPSpYT6TdXFzo7hfwY_7z8RKrRydH4GaPF-0L7EK0XIBrd53XP-ERV3cmDsbFyrezSqC2ENZyg3x_kmtI0RUMvmVf0Q"
RANKED_PLAYER_JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBybFdlQU9FYS1rNWFxbmdZUmRwZCJ9.eyJpc3MiOiJodHRwczovL2ZzbmQtc3RlZi5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWY2ZmE4ODRhNmFmNjQwMDcxZDU3ZDJhIiwiYXVkIjpbImh0dHBzOi8vZmxhZ3NhcmVmdW4uaGVyb2t1YXBwLmNvbS9hcGkvIiwiaHR0cHM6Ly9mc25kLXN0ZWYuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwMTIxNzk5MiwiZXhwIjoxNjAxMzA0MzkyLCJhenAiOiJMM043bTV2YXRyVjJQb3hIc05CWklJMFlaanlhMlBReSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJwZXJtaXNzaW9ucyI6W119.SzesGq7rz-53u3ZUpDBnYmZvSGpKVTC180YZm7PqMUZOlh9IKinJrLU5FyRsi1cjhgEFckdHz-WJIga2RO537CtVO1p7pjHZ1eY3fL32ulywlT2E1epQwx2zsHAVBCOME1iBAzeMr4natjF_W8i9b6edAMF1m9KOQpzf1fQHN-IS7vdh-DpuWGfIRpwm_6t46DuE-pjfdaGcTELWeI9ls0TkyOehjnNGYxUk_O4m6aNnEX86DmAD-W0z5qFIGJSaUOtNBqbBN_VyfdW0MBw3Y_rQPpqP5BR1Ga07x2jaGgc6ihCMmpuNQ3XDuqvZEj2xbwIdhzsXz8ZQ1aZXxiIqAA"


class FunWithFlagsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client
        self.database_path = os.environ["DATABASE_URL"]

    def tearDown(self):
        print("tear down tests")

    def assert_404(self, data, response):
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data["success"], False)
        self.assertTrue(data["error"], 404)
        self.assertEqual(data["message"], "resource not found")

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

    def test_404_country_by_id(self):
        response_country = self.client().get(f"/api/countries/{-1}")
        data = json.loads(response_country.data)
        self.assert_404(data, response_country)

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

    def test_404_get_question(self):
        response_game = self.client().patch(f"/api/questions/{9999999999999999999}")
        data = json.loads(response_game.data)
        self.assert_404(data, response_game)

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

    def test_404_patch_game(self):
        response_game = self.client().patch(f"/api/games/{9999999999999999999}")
        data = json.loads(response_game.data)
        self.assert_404(data, response_game)

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

    def test_create_ranked_game(self):
        response = self.client().post(
            "/api/games/ranked",
            headers={"Authorization": f"Bearer {RANKED_PLAYER_JWT}"},
            json={"userId": "1234", "nickname": "foobar"},
        )
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
        response = self.client().delete(
            f"/api/games/{game['id']}", headers={"Authorization": f"Bearer {ADMIN_JWT}"}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)
        for q_id in game_question_ids:
            response_question = self.client().get(f"/api/questions/{q_id}")
            self.assertEqual(response_question.status_code, 404)

    def test_delete_games(self):
        response = self.client().delete(
            "/api/games", headers={"Authorization": f"Bearer {ADMIN_JWT}"}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)

    def test_404_delete_game(self):
        response_delete_game = self.client().delete(f"/api/games/{9999999999999999999}")
        data = json.loads(response_delete_game.data)
        self.assert_404(data, response_delete_game)

    def test_get_game(self):
        game = self.test_create_game()
        response = self.client().get(f"/api/games/{game['id']}")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["success"], True)

    def test_404_get_game(self):
        response_game = self.client().get(f"/api/games/{9999999999999999999}")
        data = json.loads(response_game.data)
        self.assert_404(data, response_game)

    def test_reset_ranking(self):
        response = self.client().delete(
            "/api/games", headers={"Authorization": f"Bearer {ADMIN_JWT}"},
        )
        self.assertEqual(response.status_code, 200)
        response = self.client().get("/api/games")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertEqual(len(data["games"]), 0)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
