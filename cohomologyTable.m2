loadPackage "BGG";

-- P^1
X = Proj(QQ[a,b])
cohomologyTable(OO_X(0) ++ OO_X(1), -4, 4)
cohomologyTable(cotangentSheaf X, -4, 4)
-- twisted cubic
X = Proj(QQ[a,b,c,d] / (a*c-b^2, b*d-c^2, a*d-b*c));
cohomologyTable(OO_X^1, -4, 4)
-- Fermat quartic (a K3 surface)
X = Proj(QQ[a,b,c,d] / (a^4+b^4+c^4+d^4));
cohomologyTable(tangentSheaf X, -4, 4)


X = Proj(QQ[a,b,c,d,e] / (a^4+b^4+c^4+d^4+e^4));
cohomologyTable(tangentSheaf X, -1, 1)
cohomologyTable(sheaf exteriorPower(2, module tangentSheaf X), -1, 1)
