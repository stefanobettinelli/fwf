import unittest
import json
import os

from flaskr import create_app
from utils import get_simplified_countries, get_questions
from dotenv import load_dotenv

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
        response = self.client().get("countries")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["countries"])

    def test_get_questions_util(self):
        response = self.client().get("countries")
        data = json.loads(response.data)
        questions = get_questions(data["countries"])
        for question in questions:
            self.assertEqual(3, len(question["options"]))
            self.assertTrue(0 <= question["correctAnswer"] <= 2)

    def test_get_questions(self):
        response = self.client().get("game")
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["success"], True)
        self.assertTrue(data["questions"])
        self.assertEqual(10, len(data["questions"]))
        for question in data["questions"]:
            self.assertEqual(3, len(question["options"]))


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
