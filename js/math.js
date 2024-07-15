const math = {};

math.lerp = (a, b, t) => a + (b - a) * t;

math.invlerp = (a, b, v) => (v - a) / (b - a);

math.remap = (oldA, oldB, newA, newB, s) =>
  math.lerp(newA, newB, math.invlerp(oldA, oldB, s));

math.remapPoint = (oldBounds, newBounds, point) => {
  return [
    math.remap(
      oldBounds.left,
      oldBounds.right,
      newBounds.left,
      newBounds.right,
      point[0]
    ),
    math.remap(
      oldBounds.top,
      oldBounds.bottom,
      newBounds.top,
      newBounds.bottom,
      point[1]
    ),
  ];
};

math.add = (p1, p2) => {
  return [p1[0] + p2[0], p1[1] + p2[1]];
};
math.subtract = (p1, p2) => {
  return [p1[0] - p2[0], p1[1] - p2[1]];
};

math.formatNumber = (number, decimals = 0) => {
  return number.toFixed(decimals);
};
