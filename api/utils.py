from random import randint, sample
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


def get_quiz_questions(countries, quiz_questions=10):
    selected_countries = sample(countries, quiz_questions * QUIZ_CHOICES)
    questions = []

    for i in range(0, len(selected_countries), QUIZ_CHOICES):
        correct_answer_index = randint(0, QUIZ_CHOICES - 1)
        correct_answer = selected_countries[i : i + QUIZ_CHOICES][correct_answer_index][
            "id"
        ]
        question = {
            "correctAnswer": correct_answer,
            "options": [
                s_c["name"] for s_c in selected_countries[i : i + QUIZ_CHOICES]
            ],
        }
        questions.append(question)

    return questions
