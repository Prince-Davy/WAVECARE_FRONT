import { NssFormatPipe } from './nss-format.pipe';

describe('NssFormatPipe', () => {
  const pipe = new NssFormatPipe();

  it('should format 13-digit string according to current implementation', () => {
    expect(pipe.transform('1234567890123')).toBe('1 23 45 67 890 123');
  });

  it('should strip non-digits and format', () => {
    expect(pipe.transform(' 1.234.567.890/123 ')).toBe('1 23 45 67 890 123');
  });

  it('should return empty for null/undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should handle even-length strings according to current implementation', () => {
    expect(pipe.transform('1234')).toBe('1 23 4');
  });
});