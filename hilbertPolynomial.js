/**
 * A Hilbert polynomial object
 */
function HilbertPolynomial(length) {
  // get or set a coefficient (TODO is this good practice?)
  this.coefficient = function(index, coefficient) {
    if (coefficient === undefined)
      return this._coefficients[index]
    else {
      this._coefficients[index] = coefficient;
      return this;
    }
  }

  // add a Hilbert polynomial to the Hilbert polynomial
  this.add = function(rhs) {
    var sum;

    if (this._length < rhs._length) {
      sum = new HilbertPolynomial(rhs._length);
      for (var i = 0; i < this._length; i++)
        sum._coefficients[i] = this._coefficients[i] + rhs._coefficients[i];
      for (var i = this._length; i < rhs._length; i++)
        sum._coefficients[i] = rhs._coefficients[i];
    }
    else {
      sum = new HilbertPolynomial(this._length);
      for (var i = 0; i < rhs._length; i++)
        sum._coefficients[i] = this._coefficients[i] + rhs._coefficients[i];
      for (var i = rhs._length; i < this._length; i++)
        sum._coefficients[i] = this._coefficients[i];
    }

    return sum;
  }

  // multiply a Hilbert polynomial by an integer
  this.multiply = function(k) {
    var product = new HilbertPolynomial(this._length);
    for (var i = 0; i < this._length; i++)
      product._coefficients[i] = k * this._coefficients[i];

    return product;
  }

  // negate a Hilbert polynomial
  this.negate = function() {
    var negation = new HilbertPolynomial(this._length);
    for (var i = 0; i < this._length; i++)
      negation._coefficients[i] = -this._coefficients[i];

    return negation;
  }

  // subtract a Hilbert polynomial from the Hilbert polynomial
  this.subtract = function(rhs) {
    return this.add(rhs.negate());
  }

  // twist a sheaf
  this.twist = function(k) {
    if (k > 0)
      console.log("Cannot twist that way!");

    result = new HilbertPolynomial(this._length - k);
    for (var i = 0; i < -k; i++)
      result._coefficients[i] = 0;
    for (var i= 0; i < this._length; i++)
      result._coefficients[i - k] = this._coefficients[i];

    return result;
  }

  // constructor code
  this._length = 0;
  if (length !== undefined)
    this._length = length;
  
  this._coefficients = new Array(this._length);
}

// print Hilbert polynomial
function print(H) {
  console.log("length: ", H._length);
  console.log("  ", H._coefficients);
}

// compute the Euler characteristic based on a Hilbert polynomial
function EulerCharacteristic(H, n) {
  var chi = 0;
  for (var i = 0; i < H._length; i++) {
    if (H._coefficients[i] != 0)
      chi += H._coefficients[i] * choose(n - i, n);
  }

  return chi;
}

// compute the number in the Hodge diamond of a complete intersection of degrees m in PG(n, k)
function middleLine(n, m) {
  // dimension of the complete intersection
  d = n - m.length;

  // the Hilbert polynomial of the structure sheaf is TODO
  var structureSheaf = new HilbertPolynomial(1);
  structureSheaf.coefficient(0, 1);

  // the Hilbert polynomials of the sheaves of differential p-forms
  var differentialForms = new Array(d + 1);
  differentialForms[0] = structureSheaf;
  // the Euler sequence and exterior powers
  for (var p = 1; p <= d; p++)
    differentialForms[p] = structureSheaf.twist(-p).multiply(choose(n + 1, p)).subtract(differentialForms[p - 1]);

  // the Hilbert polynomials of the restrictions
  var restrictions = new Array(d + 1);

  // for each hypersurface
  for (var i = 0; i < m.length; i++) {
    // restrict the sheaf of differential p-forms
    for (var p = 0; p <= d; p++)
      restrictions[p] = differentialForms[p].subtract(differentialForms[p].twist(-m[i]));

    // the structure sheaf is the restriction of the structure sheaf
    differentialForms[0] = restrictions[0];

    // the adjunction formula and its exterior powers
    for (var p = 1; p <= d; p++)
      differentialForms[p] = restrictions[p].subtract(differentialForms[p - 1].twist(-m[i]));
  }

  // Lefschetz hyperplane theorem
  line = new Array(d + 1);

  for (var p = 0; p <= d; p++)
    line[p] = sign(d - p) * EulerCharacteristic(differentialForms[p], n) - (2 * p == d ? 0 : sign(d));

  return line;
}

// compute the (p,q)-entry of the Hodge diamond of the complete intersection of degrees m in PG(n, k)
function HodgeDiamond(n, m, p, q) {
  // dimension of the resulting variety
  d = n - m.length;

  if (p + q == d)
    return middleLine(n, m)[p];
  else if (p == q)
    return 1;
  else
    return 0;
}
