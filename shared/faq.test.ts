import { describe, it, expect } from 'vitest';
import { searchFAQ, getFAQByCategory, FAQ_DATABASE } from './faq';

describe('FAQ Database', () => {
  it('should have FAQ items with required fields', () => {
    expect(FAQ_DATABASE.length).toBeGreaterThan(0);

    FAQ_DATABASE.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('question');
      expect(item).toHaveProperty('answer');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('keywords');
      expect(Array.isArray(item.keywords)).toBe(true);
    });
  });

  it('should have unique FAQ IDs', () => {
    const ids = FAQ_DATABASE.map(item => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid categories', () => {
    const validCategories = ['payment', 'charging', 'account', 'general', 'technical'];
    FAQ_DATABASE.forEach(item => {
      expect(validCategories).toContain(item.category);
    });
  });
});

describe('searchFAQ', () => {
  it('should find FAQ by question keyword', () => {
    const results = searchFAQ('payment');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].question.toLowerCase()).toContain('payment');
  });

  it('should find FAQ by answer keyword', () => {
    const results = searchFAQ('mobile money');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should find FAQ by keywords array', () => {
    const results = searchFAQ('momo');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should be case insensitive', () => {
    const resultsLower = searchFAQ('charging');
    const resultsUpper = searchFAQ('CHARGING');
    expect(resultsLower.length).toBe(resultsUpper.length);
  });

  it('should return maximum 5 results', () => {
    const results = searchFAQ('a'); // Very broad search
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('should return empty array for non-matching query', () => {
    const results = searchFAQ('xyzabc123nonexistent');
    expect(results.length).toBe(0);
  });

  it('should find FAQ about pricing', () => {
    const results = searchFAQ('pricing');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].answer).toContain('₵');
  });

  it('should find FAQ about charging time', () => {
    const results = searchFAQ('how long');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should find FAQ about account creation', () => {
    const results = searchFAQ('account');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should find FAQ about support contact', () => {
    const results = searchFAQ('contact');
    expect(results.length).toBeGreaterThan(0);
    // Verify the answer contains contact information
    expect(results[0].answer).toMatch(/support|contact|whatsapp|email/i);
  });
});

describe('getFAQByCategory', () => {
  it('should return payment FAQs', () => {
    const results = getFAQByCategory('payment');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.category).toBe('payment');
    });
  });

  it('should return charging FAQs', () => {
    const results = getFAQByCategory('charging');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.category).toBe('charging');
    });
  });

  it('should return account FAQs', () => {
    const results = getFAQByCategory('account');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.category).toBe('account');
    });
  });

  it('should return general FAQs', () => {
    const results = getFAQByCategory('general');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.category).toBe('general');
    });
  });

  it('should return technical FAQs', () => {
    const results = getFAQByCategory('technical');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.category).toBe('technical');
    });
  });
});
