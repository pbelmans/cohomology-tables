For posterity reasons I should mention http://www.math.purdue.edu/~dvb/preprints/book-chap17.pdf which is the best / most readable resource I've seen so far on the subject of Hodge numbers of hypersurfaces. It's probably no coincidence that he also wrote the code on which I based my implementation.

The twisted Hodge numbers and polyvector cohomology are computed in characteristic zero by a JavaScript port of [twisted-hodge-ci](https://github.com/pbelmans/twisted-hodge-ci), by Pieter Belmans and Piet Glas, implementing Brückmann's formulas (MR0399102, MR0417202, MR0447266).
The port in `twistedHodge.js` is distributed under GPL-3.0; see `LICENSE.twistedHodge.txt`.
It uses native `BigInt` arithmetic to keep the Hodge numbers exact.

The polyvector parallelogram has row `p + q` and column `p`, with entries `h^q(X, exterior^p T_X)`.
Both Hodge diamonds use the original layout: `p + q` increases downwards and `q` increases to the right.
The twisted diamond displays `h^q(X, Omega_X^p(j))`; its twist can be any positive, zero, or negative integer.

## Shareable URLs

The ambient projective dimension and equation degrees are encoded in the path.
For example, `/cohomology-tables/6/3-3-2` describes a complete intersection of degrees 3, 3, and 2 in `P^6`.
The `twist` query parameter stores the cohomology table limit and the twisted Hodge twist, in that order.
The defaults are 7 and 0, so `/cohomology-tables/6/3-3-2?twist=6--2` uses a table limit of 6 and Hodge twist -2.
When both values are at their defaults, the query parameter is omitted.

Run the arithmetic regression tests with `node --test tests/*.test.js`.
