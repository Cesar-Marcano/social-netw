export function sum(a: number, b: number): number {
  return a + b;
}

describe('sum', () => {
  it('should return the sum of two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
