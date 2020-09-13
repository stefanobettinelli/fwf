from random import randint, sample

from constants import QUESTION_CHOICES
from models import Country


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


def get_game_questions(countries, questions_len=10):
    selected_countries = sample(countries, questions_len * QUESTION_CHOICES)
    questions = []

    for i in range(0, len(selected_countries), QUESTION_CHOICES):
        correct_answer_index = randint(0, QUESTION_CHOICES - 1)
        correct_answer = selected_countries[i : i + QUESTION_CHOICES][
            correct_answer_index
        ]["id"]
        question = {
            "correctAnswer": correct_answer,
            "options": [
                Country(
                    id=s_c["id"],
                    name=s_c["name"],
                    capital=s_c["capital"],
                    region=s_c["region"],
                    flag="",
                ).format()
                for s_c in selected_countries[i : i + QUESTION_CHOICES]
            ],
        }
        questions.append(question)

    return questions
