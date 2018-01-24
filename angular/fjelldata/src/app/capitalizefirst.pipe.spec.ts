import { CapitalizefirstPipe } from './capitalizefirst.pipe';

describe('CapitalizefirstPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  let pipe = new CapitalizefirstPipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  it('transforms "abc-def" to "Abc-Def"', () => {
    expect(pipe.transform('abc-def')).toBe('Abc-Def');
  });

  it('transforms "abc-def abc" to "Abc-Def Abc"', () => {
    expect(pipe.transform('abc-def abc')).toBe('Abc-Def Abc');
  });
  // ... more tests ...
});
