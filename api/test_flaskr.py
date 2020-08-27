import unittest
from flaskr import create_app


class FunWithFlagsTestCase(unittest.TestCase):
    def setUp(self):
        print("setting up tests")
        self.app = create_app()

    def tearDown(self):
        print("tear down tests")

    def test_countries(self):
        self.assertEqual(200, 300)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
