const math = {};

math.lerp = (a, b, t) => a + (b - a) * t;

math.invlerp = (a, b, v) => (v - a) / (b - a);

math.remap = (oldA, oldB, newA, newB, s) =>
  math.lerp(newA, newB, math.invlerp(oldA, oldB, s));

math.formatNumber = (number, decimals = 0) => {
  return number.toFixed(decimals);
};
