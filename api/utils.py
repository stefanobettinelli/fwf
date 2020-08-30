import random

from constants import QUIZ_CHOICES


def get_simplified_countries(json_countries):
    return [
        {
            "name": country["name"],
            "capital": country["capital"],
            "region": country["region"],
            "flag": country["flag"],
        }
        for country in json_countries
    ]


def get_questions(countries, quiz_questions=10):
    selected_countries = random.sample(countries, quiz_questions * QUIZ_CHOICES)
    return [
        selected_countries[i : i + QUIZ_CHOICES]
        for i in range(0, len(selected_countries), QUIZ_CHOICES)
    ]
