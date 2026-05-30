import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthorList from './AuthorList';

const mockAuthors = [
  { id: 1, name: 'Robert C. Martin', nationality: 'American' },
  { id: 2, name: 'Martin Fowler', nationality: 'British' },
];

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders author table headers', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<AuthorList />);

  expect(screen.getByRole('columnheader', { name: /^id$/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /^name$/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /nationality/i })).toBeInTheDocument();
});

test('displays authors fetched from API', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => mockAuthors,
  });

  render(<AuthorList />);

  await waitFor(() => {
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
    expect(screen.getByText('Martin Fowler')).toBeInTheDocument();
  });
});

test('renders add author form', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<AuthorList />);

  expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /nationality/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add author/i })).toBeInTheDocument();
});

test('adds a new author on form submit', async () => {
  const newAuthor = { id: 3, name: 'Kent Beck', nationality: 'American' };
  (global.fetch as ReturnType<typeof vi.fn>)
    .mockResolvedValueOnce({ ok: true, json: async () => mockAuthors })
    .mockResolvedValueOnce({ ok: true, json: async () => newAuthor });

  render(<AuthorList />);

  await waitFor(() => expect(screen.getByText('Robert C. Martin')).toBeInTheDocument());

  await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Kent Beck');
  await userEvent.type(screen.getByRole('textbox', { name: /nationality/i }), 'American');
  await userEvent.click(screen.getByRole('button', { name: /add author/i }));

  await waitFor(() => expect(screen.getByText('Kent Beck')).toBeInTheDocument());
});

test('handles fetch error gracefully', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

  render(<AuthorList />);

  await waitFor(() => {
    expect(screen.queryByText('Robert C. Martin')).not.toBeInTheDocument();
  });
});
