import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import App from './App';
import theme from './theme';

vi.mock('./components/BookList', () => ({ default: () => <div>BookList</div> }));
vi.mock('./components/AuthorList', () => ({ default: () => <div>AuthorList</div> }));

function renderApp() {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
}

test('renders sidebar with app name', () => {
  renderApp();
  expect(screen.getByText(/bibliothèque/i)).toBeInTheDocument();
});

test('renders navigation links', () => {
  renderApp();
  expect(screen.getByText('Livres')).toBeInTheDocument();
  expect(screen.getByText('Auteurs')).toBeInTheDocument();
});
