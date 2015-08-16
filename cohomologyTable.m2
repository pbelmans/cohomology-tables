cohomologyTable = (F, a, b) -> (matrix table(dim variety F + 1, b - a, (i, j) -> rank HH^i(F(a+j))));

-- P^1
X = Proj(QQ[a,b])
cohomologyTable(OO_X(0) ++ OO_X(1), -4, 4)
cohomologyTable(cotangentSheaf X, -4, 4)
-- twisted cubic
X = Proj(QQ[a,b,c,d] / (a*c-b^2, b*d-c^2, a*d-b*c));
cohomologyTable(OO_X, -4, 4)
-- Fermat quintic
X = Proj(QQ[a,b,c,d,e] / (a^5+b^5+c^5+d^5+e^5));
cohomologyTable(cotangentSheaf X, -4, 4)
