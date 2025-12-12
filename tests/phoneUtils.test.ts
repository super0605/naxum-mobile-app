import { normalizePhone, phonesMatch, findMatchingStatus } from '../src/utils/phoneUtils';

describe('phoneUtils', () => {
  describe('normalizePhone', () => {
    it('removes all non-digit characters', () => {
      expect(normalizePhone('+1 (234) 567-8900')).toBe('12345678900');
      expect(normalizePhone('123-456-7890')).toBe('1234567890');
      expect(normalizePhone('+1234567890')).toBe('1234567890');
    });

    it('handles already normalized numbers', () => {
      expect(normalizePhone('1234567890')).toBe('1234567890');
    });

    it('handles empty strings', () => {
      expect(normalizePhone('')).toBe('');
    });
  });

  describe('phonesMatch', () => {
    it('matches identical numbers', () => {
      expect(phonesMatch('1234567890', '1234567890')).toBe(true);
    });

    it('matches numbers with different formatting', () => {
      expect(phonesMatch('+1 (234) 567-8900', '12345678900')).toBe(true);
      expect(phonesMatch('123-456-7890', '1234567890')).toBe(true);
    });

    it('matches when one contains the other', () => {
      expect(phonesMatch('+1234567890', '1234567890')).toBe(true);
      expect(phonesMatch('1234567890', '+1234567890')).toBe(true);
    });

    it('returns false for different numbers', () => {
      expect(phonesMatch('1234567890', '9876543210')).toBe(false);
    });
  });

  describe('findMatchingStatus', () => {
    it('finds exact match', () => {
      const statusMap = new Map([
        ['1234567890', { phone: '1234567890', status: 'PENDING' }],
        ['9876543210', { phone: '9876543210', status: 'ACCEPTED' }],
      ]);
      
      const result = findMatchingStatus('1234567890', statusMap);
      expect(result?.status).toBe('PENDING');
    });

    it('finds normalized match', () => {
      const statusMap = new Map([
        ['1234567890', { phone: '1234567890', status: 'PENDING' }],
      ]);
      
      const result = findMatchingStatus('+1 (234) 567-8900', statusMap);
      expect(result?.status).toBe('PENDING');
    });

    it('returns undefined for no match', () => {
      const statusMap = new Map([
        ['1234567890', { phone: '1234567890', status: 'PENDING' }],
      ]);
      
      const result = findMatchingStatus('9999999999', statusMap);
      expect(result).toBeUndefined();
    });
  });
});

