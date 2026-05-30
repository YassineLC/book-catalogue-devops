import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import BookList from './BookList';
import theme from '../theme';

const mockBooks = [
  { id: 1, title: 'Clean Code', authorId: 1 },
  { id: 2, title: 'The Pragmatic Programmer', authorId: 2 },
];
const mockAuthors = [{ id: 1, name: 'Robert C. Martin', nationality: 'American' }];

function renderBookList() {
  return render(
    <ThemeProvider theme={theme}>
      <BookList />
    </ThemeProvider>
  );
}

let mockFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockFetch = vi.fn();
  vi.stubGlobal('fetch', mockFetch);
});
afterEach(() => { vi.unstubAllGlobals(); });

test('renders catalogue heading', async () => {
  mockFetch
    .mockResolvedValueOnce({ ok: true, json: async () => [] })
    .mockResolvedValueOnce({ ok: true, json: async () => [] });

  renderBookList();
  expect(screen.getByText('Catalogue')).toBeInTheDocument();
});

test('renders add book button', async () => {
  mockFetch
    .mockResolvedValueOnce({ ok: true, json: async () => [] })
    .mockResolvedValueOnce({ ok: true, json: async () => [] });

  renderBookList();
  expect(screen.getByRole('button', { name: /ajouter un livre/i })).toBeInTheDocument();
});

test('displays books fetched from API', async () => {
  mockFetch
    .mockResolvedValueOnce({ ok: true, json: async () => mockBooks })
    .mockResolvedValueOnce({ ok: true, json: async () => mockAuthors });

  renderBookList();

  await waitFor(() => {
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument();
  });
});

test('shows author name on book card', async () => {
  mockFetch
    .mockResolvedValueOnce({ ok: true, json: async () => mockBooks })
    .mockResolvedValueOnce({ ok: true, json: async () => mockAuthors });

  renderBookList();

  await waitFor(() => {
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
  });
});

test('opens add dialog on button click', async () => {
  mockFetch
    .mockResolvedValueOnce({ ok: true, json: async () => [] })
    .mockResolvedValueOnce({ ok: true, json: async () => [] });

  renderBookList();
  await userEvent.click(screen.getByRole('button', { name: /ajouter un livre/i }));
  expect(screen.getByText('Nouveau livre')).toBeInTheDocument();
});

test('filters books by search query', async () => {
  mockFetch
    .mockResolvedValueOnce({ ok: true, json: async () => mockBooks })
    .mockResolvedValueOnce({ ok: true, json: async () => mockAuthors });

  renderBookList();
  await waitFor(() => expect(screen.getByText('Clean Code')).toBeInTheDocument());

  await userEvent.type(screen.getByPlaceholderText(/rechercher par titre/i), 'clean');

  expect(screen.getByText('Clean Code')).toBeInTheDocument();
  expect(screen.queryByText('The Pragmatic Programmer')).not.toBeInTheDocument();
});

test('handles fetch error gracefully', async () => {
  mockFetch
    .mockRejectedValueOnce(new Error('Network error'))
    .mockRejectedValueOnce(new Error('Network error'));

  renderBookList();

  await waitFor(() => {
    expect(screen.queryByText('Clean Code')).not.toBeInTheDocument();
  });
});
