// compute the Hilbert series for a complete intersection with degrees m in PG(n, k)
function HilbertSeries(n, m, precision) {
  if (precision === undefined)
    precision = Series._defaultPrecision;

  H = new Series([1, -1], precision);
  H = H.invert().power(n + 1);

  for (i in m) {
    factor = new Series([1], precision);
    factor.coefficient(m[i], -1);

    H = H.multiply(factor);
  }

  return H;
}

// compute h^q(X, O_X(r))
function h(n, m, q, r) {
  // computation of N for Serre duality
  function N(n, m) {
    return _.reduce(m, function (a, b) { return a + b; }, 0) - n - 1;
  }

  // global sections
  if (q == 0) {
    // zero-dimensional schemes have to circumvent the Hilbert series
    if (n == m.length)
      return _.reduce(m, function (a, b) { return a * b; }, 1);
    
    // there are global sections
    if (r >= 0)
      return HilbertSeries(n, m, r + 1).coefficient(r);
    // no global sections
    else
      return 0;
  }

  // apply Serre duality
  else if (q == n - m.length) {
    return h(n, m, 0, N(n, m) - r);
  }

  // nothing in the middle terms
  return 0
}

