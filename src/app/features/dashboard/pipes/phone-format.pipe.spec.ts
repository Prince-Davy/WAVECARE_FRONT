import { PhoneFormatPipe } from './phone-format.pipe';

describe('PhoneFormatPipe', () => {
  const pipe = new PhoneFormatPipe();

  it('should format a French mobile number', () => {
    expect(pipe.transform('0612345678')).toBe('06 12 34 56 78');
  });

  it('should remove non digits then format', () => {
    expect(pipe.transform('+33 6 12 34 56 78')).toBe('06 12 34 56 78');
  });

  it('should return empty string for falsy value', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return original when parse fails', () => {
    spyOn<any>(pipe, 'transform').and.callThrough();
    // invalid numeric string like letters
    expect(pipe.transform('abcdef')).toBe('abcdef');
  });
});