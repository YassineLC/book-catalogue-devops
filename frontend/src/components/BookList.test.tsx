import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookList from './BookList';

const mockBooks = [
  { id: 1, title: 'Clean Code', authorId: 1 },
  { id: 2, title: 'The Pragmatic Programmer', authorId: 2 },
];

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders book table headers', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<BookList />);

  expect(screen.getByRole('columnheader', { name: /^id$/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /^title$/i })).toBeInTheDocument();
  expect(screen.getByRole('columnheader', { name: /author id/i })).toBeInTheDocument();
});

test('displays books fetched from API', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => mockBooks,
  });

  render(<BookList />);

  await waitFor(() => {
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument();
  });
});

test('renders add book form', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  render(<BookList />);

  expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
  expect(screen.getByRole('spinbutton', { name: /author id/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument();
});

test('adds a new book on form submit', async () => {
  const newBook = { id: 3, title: 'Refactoring', authorId: 1 };
  (global.fetch as ReturnType<typeof vi.fn>)
    .mockResolvedValueOnce({ ok: true, json: async () => mockBooks })
    .mockResolvedValueOnce({ ok: true, json: async () => newBook });

  render(<BookList />);

  await waitFor(() => expect(screen.getByText('Clean Code')).toBeInTheDocument());

  await userEvent.type(screen.getByRole('textbox', { name: /title/i }), 'Refactoring');
  await userEvent.type(screen.getByRole('spinbutton', { name: /author id/i }), '1');
  await userEvent.click(screen.getByRole('button', { name: /add book/i }));

  await waitFor(() => expect(screen.getByText('Refactoring')).toBeInTheDocument());
});

test('handles fetch error gracefully', async () => {
  (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

  render(<BookList />);

  await waitFor(() => {
    expect(screen.queryByText('Clean Code')).not.toBeInTheDocument();
  });
});
