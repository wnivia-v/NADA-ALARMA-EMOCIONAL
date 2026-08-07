export interface MovieQuote {
  quote: string;
  quoteEs: string;
  movie: string;
  character: string;
}

export const MOVIE_QUOTES: MovieQuote[] = [
  {
    quote:
      'It ain’t about how hard you hit. It’s about how hard you can get hit and keep moving forward.',
    quoteEs: 'No se trata de lo fuerte que golpeas, sino de cuánto puedes aguantar y seguir avanzando.',
    movie: 'Rocky Balboa',
    character: 'Rocky Balboa',
  },
  {
    quote:
      'Don’t ever let somebody tell you, you can’t do something. Not even me. You got a dream, you gotta protect it.',
    quoteEs:
      'Nunca dejes que alguien te diga que no puedes lograr algo. Ni siquiera yo. Si tienes un sueño, tienes que protegerlo.',
    movie: 'The Pursuit of Happyness',
    character: 'Chris Gardner',
  },
  {
    quote:
      'Our deepest fear is not that we are inadequate. Our deepest fear is that we are powerful beyond measure.',
    quoteEs:
      'Nuestro miedo más profundo no es ser insuficientes. Nuestro miedo más profundo es ser poderosos más allá de toda medida.',
    movie: 'Coach Carter',
    character: 'Timo Cruz',
  },
  {
    quote: 'What we do in life echoes in eternity.',
    quoteEs: 'Lo que hacemos en vida tiene eco en la eternidad.',
    movie: 'Gladiator',
    character: 'Maximus',
  },
  {
    quote: 'Every man dies, not every man really lives.',
    quoteEs: 'Todos mueren, pero no todos realmente viven.',
    movie: 'Braveheart',
    character: 'William Wallace',
  },
  {
    quote: 'It’s OK to lose to opponent. Must not lose to fear.',
    quoteEs: 'Está bien perder ante un rival. Lo que no puedes hacer es perder ante el miedo.',
    movie: 'The Karate Kid',
    character: 'Mr. Miyagi',
  },
  {
    quote: 'In this life, you don’t have to prove nothin’ to nobody but yourself.',
    quoteEs: 'En esta vida no tienes que demostrarle nada a nadie, solo a ti mismo.',
    movie: 'Rudy',
    character: 'Coach',
  },
  {
    quote: 'One step at a time. One punch at a time. One round at a time.',
    quoteEs: 'Un paso a la vez. Un golpe a la vez. Un asalto a la vez.',
    movie: 'Creed',
    character: 'Rocky Balboa',
  },
  {
    quote: 'You can’t win if you don’t get up.',
    quoteEs: 'No puedes ganar si no te levantas.',
    movie: 'Facing the Giants',
    character: 'Coach Taylor',
  },
  {
    quote: 'I am the master of my fate, I am the captain of my soul.',
    quoteEs: 'Soy el dueño de mi destino, soy el capitán de mi alma.',
    movie: 'Invictus',
    character: 'Nelson Mandela',
  },
];

export function randomMovieQuote(): MovieQuote {
  return MOVIE_QUOTES[Math.floor(Math.random() * MOVIE_QUOTES.length)];
}
