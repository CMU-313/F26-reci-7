import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { matchGuess } from '../src/wordle';

// Recitation Part 1: follow along with your TA, filling in the todos below.
// Problem set Task 1: keep adding properties until `npm run mutants:wordle`
// kills every mutant. Read the spec in src/wordle/matchGuess.ts.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The result always has exactly five colors.
// (invariant, algebraic, metamorphic, differential, or conditional)

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Step 1: a generator for five-letter uppercase words.
const wordFrom = (letters: string) =>
  fc.array(fc.constantFrom(...letters), { minLength: 5, maxLength: 5 }).map(cs => cs.join(''));
const word = wordFrom(ALPHABET);
const smallWord = fc.array(fc.constantFrom('A', 'B', 'C'), { minLength: 5, maxLength: 5 }).map(cs => cs.join(''));
const count = (s: string, L: string) => [...s].filter(c => c === L).length;

describe('matchGuess', () => {
  //invariant the result always has exactly five colors
  it('returns exactly five colors from G, Y, B', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        const colors = matchGuess(secret, guess);
        expect(colors).toHaveLength(5);
        for (const c of colors) expect(['G', 'Y', 'B']).toContain(c);
      })
    );
  });

  //conditional guessing the secret gives all greens
  it('guessing the secret gives all greens', () => {
    fc.assert(
      fc.property(word, w => {
        expect(matchGuess(w, w)).toEqual(['G', 'G', 'G', 'G', 'G']);
      }),
    );
  });

  //metamorphic the output is the same if we permute the letters of the secret and guess in the same way
  it('the output is unchanged when both words are shifted through the alphabet in the same way', () => {
    const shift = (s: string, n: number) => [...s].map(c => ALPHABET[(ALPHABET.indexOf(c) + n) % ALPHABET.length]).join('');
    fc.assert(
      fc.property(word, word, fc.integer({ min: 0, max: ALPHABET.length - 1 }), (secret, guess, n) => {
        expect(matchGuess(secret, guess)).toEqual(matchGuess(shift(secret, n), shift(guess, n)));
      }),
    );
  });

  // invariant the output credits each letter the amount of times it appears in the secret, up to the number of times it appears in the guess
  it('credits each letter exactly min(guess count, secret count) times', () => {
    fc.assert(
      fc.property(smallWord, smallWord, (secret, guess) => {
        const colors = matchGuess(secret, guess);
        for (const L of new Set(guess)) {
          const credited = [...guess].filter((c, i) => c === L && colors[i] !== 'B').length;
          expect(credited).toBe(Math.min(count(guess, L), count(secret, L)));
        }
      }),
    );
  });

  // invariant the output never credits a letter that is not in the secret
  it('never credits a letter that is not in the secret', () => {
    fc.assert(
      fc.property(word, word, (secret, guess) => {
        const result = matchGuess(secret, guess);
        for (const letter of new Set(guess)) {
          if (!secret.includes(letter)) {
            const credited = [...guess].filter((c, i) => c === letter && result[i] !== 'B').length;
            expect(credited).toBe(0);
          }
        }
      })
    );
  });
});
