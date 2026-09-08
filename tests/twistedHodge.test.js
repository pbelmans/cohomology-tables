const assert = require("node:assert/strict");
const test = require("node:test");
const { TwistedHodgeCohomology } = require("../twistedHodge");

function diamond(n, degrees, twist) {
  const X = new TwistedHodgeCohomology(n, degrees);
  return Array.from({ length: X.dimension + 1 }, (_, p) =>
    Array.from({ length: X.dimension + 1 }, (_, q) => X.hodge(twist, p, q)));
}

test("the three complete intersection K3 surfaces have the same Hodge diamond", () => {
  const expected = [[1n, 0n, 1n], [0n, 20n, 0n], [1n, 0n, 1n]];
  for (const [n, degrees] of [[3, [4]], [4, [2, 3]], [5, [2, 2, 2]]])
    assert.deepEqual(diamond(n, degrees, 0), expected);
});

test("positive and negative twists agree with the Sage reference", () => {
  // Rows are exterior degrees; columns are cohomological degrees.
  assert.deepEqual(diamond(3, [2], 2), [[9n, 0n, 0n], [6n, 0n, 0n], [1n, 0n, 0n]]);
  assert.deepEqual(diamond(4, [2, 3], 1), [[5n, 0n, 0n], [0n, 14n, 0n], [5n, 0n, 0n]]);
  assert.deepEqual(diamond(5, [2, 3], -1), [
    [0n, 0n, 0n, 1n],
    [0n, 0n, 34n, 0n],
    [0n, 7n, 0n, 0n],
    [0n, 0n, 0n, 6n]
  ]);
  const X = new TwistedHodgeCohomology(10, [3, 3]);
  assert.deepEqual(Array.from({ length: 9 }, (_, p) => X.hodge(1, p, 8 - p)),
    [0n, 0n, 3n, 776n, 5445n, 3498n, 176n, 0n, 0n]);
});

test("projective space satisfies Bott's formula", () => {
  assert.deepEqual(diamond(2, [], 3), [[10n, 0n, 0n], [8n, 0n, 0n], [1n, 0n, 0n]]);
  assert.deepEqual(diamond(2, [], -3), [[0n, 0n, 1n], [0n, 0n, 8n], [0n, 0n, 10n]]);
  assert.deepEqual(diamond(3, [], 0), [
    [1n, 0n, 0n, 0n], [0n, 1n, 0n, 0n], [0n, 0n, 1n, 0n], [0n, 0n, 0n, 1n]
  ]);
});

test("polyvector degrees identify the deformation terms of a cubic surface", () => {
  const X = new TwistedHodgeCohomology(3, [3]);
  assert.equal(X.polyvector(0, 0), 1n);
  assert.equal(X.polyvector(0, 1), 0n);
  assert.equal(X.polyvector(1, 0), 0n);
  assert.deepEqual([X.polyvector(0, 2), X.polyvector(1, 1), X.polyvector(2, 0)], [0n, 4n, 4n]);
  const P3 = new TwistedHodgeCohomology(3, []);
  assert.deepEqual([0, 1, 2, 3].map(p => P3.polyvector(p, 0)), [1n, 15n, 45n, 35n]);
});

test("Serre duality holds for positive and negative twists", () => {
  for (const [n, degrees] of [[2, [3]], [4, [2, 3]], [7, [2, 2, 3]], [8, [2, 3, 4, 5]]]) {
    const X = new TwistedHodgeCohomology(n, degrees);
    const d = X.dimension;
    for (const twist of [-11, -2, 0, 1, 8])
      for (let p = 0; p <= d; p++)
        for (let q = 0; q <= d; q++) {
          assert.equal(X.hodge(twist, p, q), X.hodge(-twist, d - p, d - q));
          assert.ok(X.hodge(twist, p, q) >= 0n);
        }
  }
});

test("linear sections and reordered equations preserve twisted cohomology", () => {
  for (const twist of [-7, 0, 4]) {
    assert.deepEqual(diamond(6, [2, 3], twist), diamond(8, [1, 3, 1, 2], twist));
    assert.deepEqual(diamond(3, [], twist), diamond(6, [1, 1, 1], twist));
  }
});

test("zero-dimensional intersections have degree(X) sections at every twist", () => {
  for (const [n, degrees, degree] of [[0, [], 1n], [1, [4], 4n], [3, [2, 3, 4], 24n]]) {
    const X = new TwistedHodgeCohomology(n, degrees);
    for (const twist of [-100, -1, 0, 1, 100]) assert.equal(X.hodge(twist, 0, 0), degree);
    assert.equal(X.polyvector(0, 0), degree);
    assert.equal(X.hodge(0, 1, 0), 0n);
    assert.equal(X.polyvector(0, 1), 0n);
  }
});

test("twists beyond floating-point precision still give exact integers", () => {
  const X = new TwistedHodgeCohomology(2, []);
  const twist = 100000000000000000000n;
  const sections = (twist + 2n) * (twist + 1n) / 2n;
  assert.equal(X.hodge(twist.toString(), 0, 0), sections);
  assert.equal(X.hodge(-twist, 2, 2), sections);
});

test("invalid inputs are rejected and out-of-range degrees give zero", () => {
  assert.throws(() => new TwistedHodgeCohomology(2, [2, 2, 2]), RangeError);
  assert.throws(() => new TwistedHodgeCohomology(2, [0]), RangeError);
  const X = new TwistedHodgeCohomology(3, [4]);
  assert.throws(() => X.hodge(0.5, 0, 0), RangeError);
  assert.throws(() => X.hodge(Number.MAX_SAFE_INTEGER + 1, 0, 0), RangeError);
  assert.throws(() => X.hodge(0, 0.5, 0), RangeError);
  assert.equal(X.hodge(0, -1, 0), 0n);
  assert.equal(X.hodge(0, 0, 3), 0n);
});
