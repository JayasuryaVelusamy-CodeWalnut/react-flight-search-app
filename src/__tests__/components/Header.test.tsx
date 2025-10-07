import { render, screen } from '@testing-library/react';
import Header from '../../../src/components/Header';

describe('Header', () => {
  it('renders the main heading', () => {
    render(<Header />);
    expect(screen.getByRole('heading', { name: /flight search/i })).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /flights/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });
});
