function hodgeNumberCell(value, p, q, description) {
  return $("<td></td>").text(value.toString()).attr({
    "data-p": p,
    "data-q": q,
    "title": description,
    "aria-label": description + ": " + value
  });
}

function drawHodgeDiamond(cohomology, twist, id) {
  var d = cohomology.dimension;
  var table = $("<table></table>").attr({
    id: id,
    "aria-label": twist === 0n ? "Hodge diamond" : "Twisted Hodge diamond, twist " + twist
  });

  // Match the existing diamond: p + q increases downwards, and q to the right.
  for (var k = 0; k <= 2 * d; k++) {
    var row = $("<tr></tr>");
    for (var i = 0; i < Math.abs(d - k); i++) row.append("<td></td>");
    for (var q = Math.max(0, k - d); q <= Math.min(k, d); q++) {
      var p = k - q;
      row.append(hodgeNumberCell(cohomology.hodge(twist, p, q), p, q,
        "h^" + q + "(X, Omega^" + p + "(" + twist + "))"));
      row.append("<td></td>");
    }
    table.append(row);
  }
  return table;
}

function drawPolyvectorParallelogram(cohomology) {
  var d = cohomology.dimension;
  var table = $("<table id='polyvectorParallelogram' aria-label='Polyvector parallelogram'></table>");

  // As in PolyvectorParallelogram.pprint(): row p + q, column p.
  // In particular, row 2 is H^2(O_X), H^1(T_X), H^0(exterior^2 T_X).
  for (var k = 0; k <= 2 * d; k++) {
    var row = $("<tr></tr>");
    for (var p = 0; p <= d; p++) {
      var q = k - p;
      if (q < 0 || q > d) row.append("<td></td>");
      else row.append(hodgeNumberCell(cohomology.polyvector(p, q), p, q,
        "h^" + q + "(X, exterior^" + p + " T_X)"));
    }
    table.append(row);
  }
  return table;
}
