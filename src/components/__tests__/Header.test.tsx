/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

const mockOnMenuToggle = jest.fn();
const mockOnSearch = jest.fn();

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with logo and navigation', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByText('CYBER MART 2077')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays navigation links', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
    expect(screen.getByText('Automation')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('calls onMenuToggle when menu button is clicked', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
      />
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when search input is used', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('displays user authentication status', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
        isAuthenticated={true}
        userName="Test User"
      />
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows login/register buttons when not authenticated', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
        isAuthenticated={false}
      />
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('displays cart icon with item count', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
        cartItemCount={5}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
      />
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    const searchInput = screen.getByPlaceholderText(/search/i);

    expect(menuButton).toHaveAttribute('aria-label');
    expect(searchInput).toHaveAttribute('aria-label');
  });

  it('handles search input focus and blur', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);

    fireEvent.focus(searchInput);
    expect(searchInput).toHaveFocus();

    fireEvent.blur(searchInput);
    expect(searchInput).not.toHaveFocus();
  });

  it('clears search when clear button is clicked', () => {
    render(
      <Header
        onMenuToggle={mockOnMenuToggle}
        onSearch={mockOnSearch}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
