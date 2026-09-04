import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { CONTACT_EMAIL } from './data/constants';

describe('App', () => {
  it('renders the hero heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/distributed systems/i);
  });

  it('exposes a real contact address, not a placeholder', () => {
    // Regression guard: the site shipped robelfekadu@example.com for a while,
    // which silently broke the only way to contact anyone.
    expect(CONTACT_EMAIL).not.toMatch(/example\.(com|org|net)$/);
    expect(CONTACT_EMAIL).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);

    render(<App />);
    const mailtos = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
      .filter((h): h is string => !!h?.startsWith('mailto:'));

    expect(mailtos.length).toBeGreaterThan(0);
    expect(mailtos.every((h) => h === `mailto:${CONTACT_EMAIL}`)).toBe(true);
  });
});
