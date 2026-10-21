# Shift Squares

A sliding tile puzzle built with React. Each game pulls a random photo, slices it into tiles, and scrambles them. Slide the pieces back into place to rebuild the picture.

## Live Demo

[shift-puzzle-game.netlify.app](https://shift-puzzle-game.netlify.app)

## Features

- Three difficulty levels: 3×3, 4×4, and 5×5
- Two modes: **Timed** (scored, with a countdown) and **Relaxed** (no timer, no score, no pressure)
- A new photo from the Lorem Picsum API every game, with photographer credit
- Mouse, touch, and keyboard controls (arrow keys to move, P or Escape to pause)
- Smooth tile sliding, with motion turned off for players who prefer reduced motion
- Pause that hides the board, plus automatic pause when you switch tabs
- Resume after refresh: reloading mid-game brings back the same picture, board, moves, and time
- High scores saved per difficulty, plus games played and six achievements
- Offline fallback: if the image can't load, play with numbered tiles instead
- Handles empty or corrupted saved data without crashing
- Responsive layout that works on phones and desktop

## How to Play

1. Enter your name, pick a difficulty, and choose Timed or Relaxed mode.
2. Click or tap a tile next to the empty space to slide it into that space. Arrow keys work too.
3. Rebuild the picture. The small preview under the board shows the finished image. Click on the image for a more detailed view. The clock keeps running as you view the image.
4. The clock starts on your first move, so take a moment to study the picture first.

### Rules and Scoring

| Level | Grid | Time limit (Timed mode) |
| --- | --- | --- |
| Easy | 3×3 | 2:00 |
| Medium | 4×4 | 5:00 |
| Hard | 5×5 | 10:00 |

In Timed mode, you win by solving the puzzle before the clock runs out. Your score is:

```
1000 + (10 × seconds left) − (5 × moves)
```

Scores never go below zero. Finishing fast with fewer moves earns the most points.

Relaxed mode has no time limit and no way to lose. A stopwatch shows how long you took, but relaxed games aren't scored and don't appear on the leaderboard.

### Achievements

| Achievement | How to unlock |
| --- | --- |
| First Solve | Finish any puzzle |
| Under a Minute | Solve a timed game in under 60 seconds |
| High Scorer | Score 1,500 or more |
| Efficient | Solve a 3×3 in 40 moves or fewer |
| Grand Master | Solve a 5×5 puzzle |
| Dedicated | Play 10 games |

## Technologies Used

- React (functional components and hooks)
- React Router for the Home, Game, Game Over, and Leaderboard screens
- React Context for shared player data
- Vite for development and builds
- CSS with custom properties for theming
- localStorage for scores and settings, sessionStorage for the game in progress
- Netlify for hosting

## APIs Used

| Name | URL | Purpose | Key required |
| --- | --- | --- | --- |
| Lorem Picsum | https://picsum.photos | Supplies a random photo for each puzzle, along with the photographer's name | No |

The game requests a page of photos from the `/v2/list` endpoint, picks one at random, and builds a square image URL from its ID. It shows a loading state while the image downloads and an error state with a retry option if the request fails.

## Project Structure

```
src/
├── api/
│   └── picsum.js            Fetches and preloads puzzle images
├── components/
│   ├── GameBoard.jsx        Draws the tiles and handles clicks
│   └── Timer.jsx            Countdown or stopwatch display
├── context/
│   ├── PlayerContext.js     The shared context object
│   └── PlayerProvider.jsx   Player name, settings, scores, achievements
├── game/
│   ├── achievements.js      Achievement definitions and checks
│   ├── formatTime.js        Formats seconds as m:ss
│   ├── puzzle.js            Pure puzzle logic: shuffle, move, win check
│   ├── savedGame.js         Saves and restores the game in progress
│   └── scoring.js           Score calculation
├── hooks/
│   ├── useLocalStorage.js   Persistent state with corruption handling
│   ├── usePlayer.js         Reads the player context
│   ├── usePuzzleImage.js    Image loading and error states
│   ├── useStopwatch.js      Counts up for Relaxed mode
│   └── useTimer.js          Counts down for Timed mode
├── pages/
│   ├── Home.jsx
│   ├── Game.jsx
│   ├── GameOver.jsx
│   └── Leaderboard.jsx
├── App.jsx                  Routes
├── config.js                Tunable values: levels, scoring, storage keys
├── index.css                Styles and color tokens
└── main.jsx                 App entry, router, and provider
public/
└── _redirects               Lets Netlify serve the app on any route
```

The puzzle rules in `game/puzzle.js` are plain JavaScript with no React, which keeps game logic separate from the components that display it.

<!-- ## Future Enhancements

- Replace the random photos with my own artwork
- A jigsaw version with shaped pieces you rotate and place on a canvas
- Sound effects and themes
- A statistics page with play history -->

## Author

Rania Kandil

## License

MIT
