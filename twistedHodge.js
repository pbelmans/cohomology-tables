// Characteristic-zero port of Brückmann's formulas from twisted-hodge-ci.
// Copyright Pieter Belmans and Piet Glas.
// https://github.com/pbelmans/twisted-hodge-ci/blob/master/twisted_ci/twisted_ci.py
// SPDX-License-Identifier: GPL-3.0-only (see LICENSE.twistedHodge.txt).

// Unlike choose(), this binomial is zero for negative upper arguments.
// BigInt keeps the alternating sums exact, including for large twists.
function twistedBinomial(n, k) {
  n = BigInt(n);
  if (k < 0 || n < BigInt(k)) return 0n;
  var result = 1n;
  for (var i = 1; i <= k; i++)
    result = result * (n - BigInt(i - 1)) / BigInt(i);
  return result;
}

function TwistedHodgeCohomology(n, degrees) {
  if (!Number.isInteger(n) || n < 0 || degrees.length > n ||
      degrees.some(function(m) { return !Number.isInteger(m) || m < 1; }))
    throw new RangeError("Invalid complete intersection.");

  this.dimension = n - degrees.length;
  this.anticanonicalTwist = BigInt(n + 1) - degrees.reduce(function(sum, m) {
    return sum + BigInt(m);
  }, 0n);

  // Linear sections just lower the ambient dimension. Sorting makes the
  // recursion and its cache independent of the order of the equations.
  n -= degrees.filter(function(m) { return m === 1; }).length;
  degrees = degrees.filter(function(m) { return m > 1; }).sort(function(a, b) {
    return a - b;
  });
  if (degrees.length === 0) {
    n++;
    degrees = [1];
  }

  var cache = new Map();
  var sectionCache = new Map();
  var sums = [0];
  var products = [1n];
  for (var c = 0; c < degrees.length; c++) {
    sums.push(sums[c] + degrees[c]);
    products.push(products[c] * BigInt(degrees[c]));
  }

  // The alpha function of [2], Lemma 1, using inclusion-exclusion.
  function sections(c, j) {
    if (j < 0n) return 0n;
    var key = c + ":" + j;
    if (sectionCache.has(key)) return sectionCache.get(key);
    var value = c === 0 ? twistedBinomial(j + BigInt(n), n) :
      sections(c - 1, j) - sections(c - 1, j - BigInt(degrees[c - 1]));
    sectionCache.set(key, value);
    return value;
  }

  // The varphi and sigma functions of [1], equation (29).
  function varphi(d, m, p, j) {
    var value = twistedBinomial(j - 1n, p) *
      twistedBinomial(j + BigInt(d + 1 - p), d + 1 - p);
    for (var i = 1; i <= p + 1; i++)
      value += (i % 2 ? -1n : 1n) * twistedBinomial(d + 2, p + 1 - i) *
        twistedBinomial(j + BigInt(d - i * (m - 1) - p), d + 1);
    return value;
  }

  function sigma(d, m, j) {
    var value = 0n;
    for (var i = 0; i <= d + 2; i++)
      value += (i % 2 ? -1n : 1n) * twistedBinomial(d + 2, i) *
        twistedBinomial(-j - BigInt((i - 1) * (m - 1)), d + 1);
    return value;
  }

  function h(c, j, p, q) {
    var d = n - c;
    if (p < 0 || q < 0 || p > d || q > d) return 0n;
    // Every line bundle on a smooth zero-dimensional intersection has
    // degree(X) sections, even at negative twists.
    if (d === 0) return products[c];
    var key = [c, j, p, q].join(":");
    if (!cache.has(key)) cache.set(key, compute(c, j, p, q));
    return cache.get(key);
  }

  function compute(c, j, p, q) {
    var d = n - c;
    var m = degrees[c - 1];
    var twist = BigInt(m);
    var K = BigInt(sums[c] - n - 1);

    // Structure and canonical bundles: [1], (19)-(20), [2], (10)-(11).
    if (p === 0) {
      if (q === 0) return sections(c, j);
      if (q === d) return sections(c, K - j);
      return 0n;
    }
    if (p === d) {
      if (q === 0) return sections(c, K + j);
      if (q === d) return sections(c, -j);
      return 0n;
    }

    if (c === 1) {
      // Hypersurfaces: [1], Satz 2, equations (38)-(41).
      if (q === 0) return varphi(d, m, p, j);
      if (q === d) return varphi(d, m, d - p, -j);
      var diagonal = p === q && j === 0n ? 1n : 0n;
      if (p + q !== d) return diagonal;
      return sigma(d, m, j - BigInt(p * m)) + diagonal;
    }

    // Complete intersections: [3], Satz 5(5.1)-(5.4).
    if (q > 0 && q < d - p) return h(c - 1, j, p, q);
    if (q === 0)
      return h(c - 1, j, p, 0) - h(c - 1, j - twist, p, 0) -
        h(c, j - twist, p - 1, 0) + h(c - 1, j - twist, p, 1);
    if (q === d) return h(c, -j, d - p, 0);
    if (q === 1 && p === d - 1)
      return h(c - 1, j, d, 0) - h(c - 1, j, d, 1) + h(c - 1, j, d, 2) -
        h(c - 1, j + twist, d, 0) + h(c - 1, j + twist, d, 1) +
        h(c, j, d - 1, 0) + h(c, j + twist, d, 0);
    if (q === d - p)
      return h(c, j + twist, p + 1, d - p - 1) - h(c - 1, j, p + 1, d - p) +
        h(c - 1, j + twist, p + 1, d - p) - h(c - 1, j + twist, p + 1, d - p - 1) +
        h(c - 1, -j, d - p, p) + h(c, j, p, d - p - 1) -
        h(c, -j - twist, d - p - 1, p);
    return h(c, -j, d - p, d - q);
  }

  this.hodge = function(j, p, q) {
    if (typeof j === "number" && !Number.isSafeInteger(j))
      throw new RangeError("Pass large twists as an integer string or BigInt.");
    if (!Number.isInteger(p) || !Number.isInteger(q))
      throw new RangeError("Cohomological degrees must be integers.");
    return h(degrees.length, BigInt(j), p, q);
  };

  this.polyvector = function(p, q) {
    // Exterior^p T_X = Omega_X^(d-p) tensor omega_X^(-1).
    return this.hodge(this.anticanonicalTwist, this.dimension - p, q);
  };
}

if (typeof module !== "undefined" && module.exports)
  module.exports = { TwistedHodgeCohomology, twistedBinomial };
