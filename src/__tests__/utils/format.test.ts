import { pluralize, formatPassengerCount, getTotalPassengers } from '../../utils/format';

describe('pluralize', () => {
  it('returns singular form for count of 1', () => {
    expect(pluralize(1, 'cat', 'cats')).toBe('1 cat');
  });

  it('returns plural form for count of 0', () => {
    expect(pluralize(0, 'cat', 'cats')).toBe('0 cats');
  });

  it('returns plural form for count greater than 1', () => {
    expect(pluralize(2, 'cat', 'cats')).toBe('2 cats');
  });
});

describe('formatPassengerCount', () => {
  it('returns default case when no passengers', () => {
    expect(formatPassengerCount(0, 0, 0)).toBe('1 Adult');
  });

  it('formats single adult correctly', () => {
    expect(formatPassengerCount(1, 0, 0)).toBe('1 Adult');
  });

  it('formats multiple adults correctly', () => {
    expect(formatPassengerCount(2, 0, 0)).toBe('2 Adults');
  });

  it('formats mixed passengers correctly', () => {
    expect(formatPassengerCount(2, 1, 1)).toBe('2 Adults, 1 Child, 1 Infant');
  });

  it('formats single child correctly', () => {
    expect(formatPassengerCount(1, 1, 0)).toBe('1 Adult, 1 Child');
  });

  it('formats single infant correctly', () => {
    expect(formatPassengerCount(1, 0, 1)).toBe('1 Adult, 1 Infant');
  });
});

describe('getTotalPassengers', () => {
  it('returns singular for one passenger', () => {
    expect(getTotalPassengers(1, 0, 0)).toBe('1 Traveller');
  });

  it('returns plural for multiple passengers', () => {
    expect(getTotalPassengers(2, 1, 1)).toBe('4 Travellers');
  });

  it('handles zero case', () => {
    expect(getTotalPassengers(0, 0, 0)).toBe('0 Travellers');
  });

  it('includes infants in total count', () => {
    expect(getTotalPassengers(1, 0, 2)).toBe('3 Travellers');
  });
});
