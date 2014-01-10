/**
 * a power series object
 *
 * nothing but a wrapper around an array of numbers
 */
function Series(coefficients, precision) {
  if (coefficients.length == 0)
    console.log("You must specify at least the constant coefficient");
  if (_.filter(coefficients, function(c) { return typeof(c) != "number"; }).length != 0)
    console.log("You must only specify numbers");

  // constants
  this._defaultPrecision = 10;

  // add a second power series to the power series
  this.add = function(series) {
    // the precision of the product is given by the minimum of the precisions
    precision = Math.min(series.precision(), this.precision());

    coefficients = [];
    for (var i = 0; i < precision; i++)
      coefficients.push(this._coefficients[i] + series._coefficients[i]);

    return new Series(coefficients, precision);
  }

  // get or set a coefficient (TODO is this good practice?)
  this.coefficient = function(index, coefficient) {
    if (coefficient === undefined)
      return this._coefficients[index]
    else {
      this._coefficients[index] = coefficient;
      return this;
    }
  }

  // change the precision of the power series
  this.changePrecision = function(precision) {
    // truncate precision
    if (precision < this._coefficients.length)
      this._coefficients = this._coefficients.slice(0, precision);
    // add zeroes
    else {
      for (var i = this._coefficients.length; i < precision; i++)
        this._coefficients.push(0);
    }

    return this;
  }

  // invert the power series
  this.invert = function() {
    if (this._coefficients[0] == 0)
      console.log("The constant coefficient should be nonzero");

    var coefficients = [];
    coefficients.push(1 / this._coefficients[0]);

    for (var i = 1; i < this.precision(); i++) {
      var pairs = _.zip(coefficients.slice(0, i), this._coefficients.slice(1, i + 1).reverse());
      var terms = _.map(pairs, function (a) { return a[0] * a[1]; });
      var sum = _.reduce(terms, function(c, d) { return c + d; }, 0);

      coefficients.push(-1.0 * sum / this._coefficients[0]);
    }

    return new Series(coefficients, this.precision());
  }

  // multiply a second power series with the power series
  this.multiply = function(series) {
    // the precision of the product is given by the minimum of the precisions
    precision = Math.min(series.precision(), this.precision());

    coefficients = []
    for (var i = 0; i < precision; i++) {
      coefficients.push(0);

      for (var j = 0; j <= i; j++)
        coefficients[i] += this._coefficients[j] * series._coefficients[i - j];
    }

    return new Series(coefficients, precision);
  }

  // take the nth power of the power series
  this.power = function(n) {
    if (n > 0)
      return this.power(n - 1).multiply(this); // an inefficient way of computing a power
    else if (n == 0) {
      coefficients = [1];

      for (var i = 1; i < this.precision(); i++)
        coefficients.push(0);

      return new Series(coefficients, this.precision());
    }
    else {
      return this.invert().power(-n);
    }
  }

  // get the precision of the power series
  this.precision = function() {
    return this._coefficients.length;
  }

  // constructor code
  this._coefficients = coefficients;

  if (precision === undefined)
    this.changePrecision(this._defaultPrecision);
  else
    this.changePrecision(precision);
}


