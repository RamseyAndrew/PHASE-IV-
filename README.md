# Ludo Game Application

## Project Overview
This is a full-stack Ludo game application featuring a Flask backend API and a React frontend. The application allows multiple players to create accounts, start and join games, roll dice, move tokens on a Ludo board, capture opponent tokens, and track moves in real-time. It also provides game history and player management functionalities.

## Technology Stack
- **Backend:**
  - Python 3.13
  - Flask (REST API)
  - Flask-SQLAlchemy (ORM)
  - Flask-Migrate (Database migrations)
  - Flask-CORS (Cross-Origin Resource Sharing)
  - Flask-Marshmallow & Marshmallow-SQLAlchemy (Serialization and validation)
  - SQLite (default database)
- **Frontend:**
  - React 19
  - Vite (Build tool)
  - React Router DOM (Routing)
  - Axios (HTTP client)
  - Formik & Yup (Form handling and validation)
  - CSS for styling

## Features
- Player management: Create, update, delete players with unique names and scores.
- Game management: Create, update, delete games with statuses (ongoing, finished, paused).
- Dice rolling with animated 3D dice.
- Token movement on the board with capture logic.
- Turn management for 4 players (Blue, Red, Green, Yellow).
- Move tracking and history per game.
- RESTful API endpoints for players, games, and moves.
- Frontend pages for login, home, game play, move history, and game selection.

## Installation

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Install dependencies:
   ```bash
   pip install pipenv
   pipenv install
   ```
5. Run database migrations:
   ```bash
   pipenv run flask db upgrade
   ```
6. Start the backend server:
   ```bash
   pipenv run python run.py
   ```
   The backend API will be available at `http://localhost:5000/api`.

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:3000` to access the frontend.

## API Endpoints

### Players
- `GET /api/players` - List all players
- `POST /api/players` - Create a new player
- `GET /api/players/{id}` - Get player by ID
- `PATCH /api/players/{id}` - Update player by ID
- `DELETE /api/players/{id}` - Delete player by ID

### Games
- `GET /api/games` - List all games
- `POST /api/games` - Create a new game
- `GET /api/games/{id}` - Get game by ID
- `PATCH /api/games/{id}` - Update game by ID
- `DELETE /api/games/{id}` - Delete game by ID

### Moves
- `GET /api/moves` - List all moves
- `GET /api/games/{game_id}/moves` - List moves for a specific game
- `POST /api/moves` - Create a new move
- `GET /api/moves/{id}` - Get move by ID
- `PATCH /api/moves/{id}` - Update move by ID
- `DELETE /api/moves/{id}` - Delete move by ID

## Frontend Pages and Components

- **Login:** Entry page for player login.
- **Home:** Dashboard to view and manage players and games.
- **Game:** Main gameplay interface with board, dice, and turn management.
- **History:** View move history for a specific game.
- **Game Selection:** Select or create games to join.
- **Components:** Board, Token, TurnManager, TokenCapture logic, and more.

## Project Structure

```
/backend
  ├── app/
  │   ├── __init__.py       # Flask app factory and extensions
  │   ├── models.py         # Database models (Player, Game, Move)
  │   ├── routes.py         # API route handlers
  │   ├── schemas.py        # Marshmallow schemas for validation
  ├── migrations/           # Database migration scripts
  ├── run.py                # Entry point to start Flask server
  ├── Pipfile               # Python dependencies
/client
  ├── src/
  │   ├── components/       # React components (App, Board, TurnManager, etc.)
  │   ├── pages/            # React pages (Home, Login, History, Moves, GameSelection)
  │   ├── services/         # API service (axios instance)
  │   ├── main.jsx          # React app entry point
  ├── package.json          # Node dependencies and scripts
  ├── vite.config.js        # Vite configuration
```

## Usage

- Start backend and frontend servers as described in Installation.
- Use the frontend UI to create players and games.
- Join a game and take turns rolling dice and moving tokens.
- Moves are tracked and can be viewed in the history page.
- The game supports 4 players with turn management and token capture.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the terms of the MIT License.

---

This README provides a comprehensive overview and instructions to get started with the Ludo Game application. For any questions or issues, please open an issue in the repository.
