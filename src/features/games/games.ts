const NYT = 'https://www.nytimes.com'

export interface Game {
  name: string
  description: string
  url: string
  /** Free to play without a New York Times Games subscription. */
  free: boolean
  tile: string
}

/** Daily puzzles from New York Times Games. Links open nytimes.com in a new tab. */
export const games: readonly Game[] = [
  {
    name: 'Wordle',
    description: 'Guess the word in 6 tries',
    url: `${NYT}/games/wordle/index.html`,
    free: true,
    tile: 'bg-meditate',
  },
  {
    name: 'Connections',
    description: 'Group words that share a thread',
    url: `${NYT}/games/connections`,
    free: true,
    tile: 'bg-sleep',
  },
  {
    name: 'Strands',
    description: 'Find the hidden theme words',
    url: `${NYT}/games/strands`,
    free: true,
    tile: 'bg-reflect',
  },
  {
    name: 'The Mini',
    description: 'A quick 5×5 crossword',
    url: `${NYT}/crosswords/game/mini`,
    free: true,
    tile: 'bg-move',
  },
  {
    name: 'Spelling Bee',
    description: 'Make words from 7 letters',
    url: `${NYT}/puzzles/spelling-bee`,
    free: false,
    tile: 'bg-reflect',
  },
  {
    name: 'The Crossword',
    description: 'The classic daily puzzle',
    url: `${NYT}/crosswords/game/daily`,
    free: false,
    tile: 'bg-meditate',
  },
  {
    name: 'Letter Boxed',
    description: 'Link letters around the square',
    url: `${NYT}/puzzles/letter-boxed`,
    free: false,
    tile: 'bg-move',
  },
  {
    name: 'Tiles',
    description: 'A calming pattern-matching game',
    url: `${NYT}/puzzles/tiles`,
    free: false,
    tile: 'bg-sleep',
  },
  {
    name: 'Sudoku',
    description: 'Fill the grid with 1 to 9',
    url: `${NYT}/puzzles/sudoku`,
    free: false,
    tile: 'bg-mint',
  },
]

export const allGamesUrl = `${NYT}/crosswords`
