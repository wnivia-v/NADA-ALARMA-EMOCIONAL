export interface MovieQuote {
  quote: string;
  movie: string;
  character: string;
}

export const MOVIE_QUOTES: MovieQuote[] = [
  {
    quote:
      'It ain’t about how hard you hit. It’s about how hard you can get hit and keep moving forward.',
    movie: 'Rocky Balboa',
    character: 'Rocky Balboa',
  },
  {
    quote:
      'Don’t ever let somebody tell you, you can’t do something. Not even me. You got a dream, you gotta protect it.',
    movie: 'The Pursuit of Happyness',
    character: 'Chris Gardner',
  },
  {
    quote:
      'Our deepest fear is not that we are inadequate. Our deepest fear is that we are powerful beyond measure.',
    movie: 'Coach Carter',
    character: 'Timo Cruz',
  },
  {
    quote: 'What we do in life echoes in eternity.',
    movie: 'Gladiator',
    character: 'Maximus',
  },
  {
    quote: 'Every man dies, not every man really lives.',
    movie: 'Braveheart',
    character: 'William Wallace',
  },
  {
    quote: 'It’s OK to lose to opponent. Must not lose to fear.',
    movie: 'The Karate Kid',
    character: 'Mr. Miyagi',
  },
  {
    quote: 'In this life, you don’t have to prove nothin’ to nobody but yourself.',
    movie: 'Rudy',
    character: 'Coach',
  },
  {
    quote: 'One step at a time. One punch at a time. One round at a time.',
    movie: 'Creed',
    character: 'Rocky Balboa',
  },
  {
    quote: 'You can’t win if you don’t get up.',
    movie: 'Facing the Giants',
    character: 'Coach Taylor',
  },
  {
    quote: 'I am the master of my fate, I am the captain of my soul.',
    movie: 'Invictus',
    character: 'Nelson Mandela',
  },
];

export function randomMovieQuote(): MovieQuote {
  return MOVIE_QUOTES[Math.floor(Math.random() * MOVIE_QUOTES.length)];
}
