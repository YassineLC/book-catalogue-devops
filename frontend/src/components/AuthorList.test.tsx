import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import AuthorList from './AuthorList';
import theme from '../theme';

const mockAuthors = [
  { id: 1, name: 'Robert C. Martin', nationality: 'American' },
  { id: 2, name: 'Martin Fowler', nationality: 'British' },
];

function renderAuthorList() {
  return render(
    <ThemeProvider theme={theme}>
      <AuthorList />
    </ThemeProvider>
  );
}

let mockFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockFetch = vi.fn();
  vi.stubGlobal('fetch', mockFetch);
});
afterEach(() => { vi.unstubAllGlobals(); });

test('renders auteurs heading', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

  renderAuthorList();
  expect(screen.getByText('Auteurs')).toBeInTheDocument();
});

test('renders add author button', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

  renderAuthorList();
  expect(screen.getByRole('button', { name: /ajouter un auteur/i })).toBeInTheDocument();
});

test('displays authors fetched from API', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockAuthors });

  renderAuthorList();

  await waitFor(() => {
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
    expect(screen.getByText('Martin Fowler')).toBeInTheDocument();
  });
});

test('displays nationality chips', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockAuthors });

  renderAuthorList();

  await waitFor(() => {
    expect(screen.getByText('American')).toBeInTheDocument();
    expect(screen.getByText('British')).toBeInTheDocument();
  });
});

test('opens add dialog on button click', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

  renderAuthorList();
  await userEvent.click(screen.getByRole('button', { name: /ajouter un auteur/i }));
  expect(screen.getByText('Nouvel auteur')).toBeInTheDocument();
});

test('filters authors by search query', async () => {
  mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockAuthors });

  renderAuthorList();
  await waitFor(() => expect(screen.getByText('Robert C. Martin')).toBeInTheDocument());

  await userEvent.type(screen.getByPlaceholderText(/rechercher par nom/i), 'fowler');

  expect(screen.getByText('Martin Fowler')).toBeInTheDocument();
  expect(screen.queryByText('Robert C. Martin')).not.toBeInTheDocument();
});

test('handles fetch error gracefully', async () => {
  mockFetch.mockRejectedValueOnce(new Error('Network error'));

  renderAuthorList();

  await waitFor(() => {
    expect(screen.queryByText('Robert C. Martin')).not.toBeInTheDocument();
  });
});
