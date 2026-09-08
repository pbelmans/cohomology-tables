For posterity reasons I should mention http://www.math.purdue.edu/~dvb/preprints/book-chap17.pdf which is the best / most readable resource I've seen so far on the subject of Hodge numbers of hypersurfaces. It's probably no coincidence that he also wrote the code on which I based my implementation.

The twisted Hodge numbers and polyvector cohomology are computed in characteristic zero by a JavaScript port of [twisted-hodge-ci](https://github.com/pbelmans/twisted-hodge-ci), by Pieter Belmans and Piet Glas, implementing Brückmann's formulas (MR0399102, MR0417202, MR0447266).
The port in `twistedHodge.js` is distributed under GPL-3.0; see `LICENSE.twistedHodge.txt`.
It uses native `BigInt` arithmetic to keep the Hodge numbers exact.

The polyvector parallelogram has row `p + q` and column `p`, with entries `h^q(X, exterior^p T_X)`.
Both Hodge diamonds use the original layout: `p + q` increases downwards and `q` increases to the right.
The twisted diamond displays `h^q(X, Omega_X^p(j))`; its twist can be any positive, zero, or negative integer.

Run the arithmetic regression tests with `node --test tests/*.test.js`.
