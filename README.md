## Available Scripts

Very simple quiz app.

2 play modes
 
- "Quick play" 10 random question, guess the correct flag among 3 choices.
- "Ranked" 10 random questions, results are recorded. Rankings can be viewed 
by clicking the top right icon. In order to play ranked you need to register, click
the login button and then choose sign-up.


 

##### [Click here to Play](https://flagsarefun.herokuapp.com/)
 
## Project dependencies

## Getting Started

### Installing Dependencies

#### APIs

Install react front-end dependencies

```bash
npm install
```

Run it

```bash
npm start
```

local webpack server is at [localhost:3000](http://localhost:300)


#### APIs

Do once

```bash
cd api
```

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

To setup vurtual environment run the following command

```bash
pipenv shell
```

#### Installing Dependencies

```bash
pipenv install -r requirements.txt
```

This will install all the required packages we selected within the `requirements.txt` file.

## Database Setup

Install Postgres locally, update for DB address setup.sh.
To update the database and seed run the following :

```bash
python manage.py db init
python manage.py db migrate
python manage.py db upgrade
```

- you may need to change the database url in setup.sh after which you can run

```bash
source setup.sh
```

- Start server by running

```bash
flask run
```

## Testing

Replace the jwt tokens in test_app.py with the ones generated on the website.

```
chmod +x run_api_tests.sh
./run_api_test.sh
```

## API
Most of the end point don't authorization, for those that is required `auth required` will be noted.

##### GET requests

- `/api/hello`
Simple health check for backend

- `/api/countries`
Get all countries

- `/api/countries/<c_id>`
Get single country by id

- `/api/games`
Get all generated games

- `/api/games/<g_id>`
Get game by id

- `/api/questions`
Get all questions

- `/api/questions/<q_id>`
Get question by id

- `/api/question/<q_id>/flag`
Return the flag for q_id question, it's a url base 64 encoded. So after getting a question by id
the UI asks for the question flag, in order not be clearly visible in the network response, the backend
encodes it and the UI then decodes it and it can then use the URL to display the flag.

- `/api/rankings`
Get players rankings


##### POST requests

- `/api/games`
Creates a quick play game (does not require to be logged in) and returns a json containing a list of 10 random questions

- `[auth required]` `/api/games/ranked`
Creates a ranked game

##### PATCH requests

- `/api/games/<g_id>`
End a game (g_id) by updating the end time (server time)

- `/api/questions/<q_id>`
Updates a question with the selected answer (payload as a json body)

##### DELETE requests

- `[requires auth with admin right]` `/api/games`
Deletes al games

- `[requires auth with admin right]` `/api/games/<g_id>`
Delete a single game by id