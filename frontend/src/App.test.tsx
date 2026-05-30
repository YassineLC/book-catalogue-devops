import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app bar with title', () => {
  render(<App />);
  const titleElement = screen.getByText(/book catalogue/i);
  expect(titleElement).toBeInTheDocument();
});