import unittest
import json
from flaskr import create_app
from utils import get_simplified_countries


class FunWithFlagsTestCase(unittest.TestCase):
    def setUp(self):
        print("setting up tests")
        self.app = create_app()

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
        self.assertEqual(200, 300)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
