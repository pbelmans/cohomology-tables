// quick and dirty binomial coefficients in JS
// ported from the original code, uses floating point arithmetic (!)
function choose(a, b) {
  if (a < 0)
    return Math.pow(-1, b) * choose(b - a - 1, b);
  if (a < b)
    return 0;
  if (a - b < b)
    b = a - b;

  result = 1.0;

  for (var i = 0; i < b; i++) {
    result /= b - i;
    if (Math.pow(2, 53) / (a - i) < result) // TODO fix this
      console.log("Overflow!");
    result *= a - i;
  }

  return Math.round(result);
}

function sign(n) {
  return (n % 2 == 0 ? 1 : -1);
}
