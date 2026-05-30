import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton,
  TextField, Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Chip, Snackbar, Alert,
  InputAdornment, Skeleton, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const BOOKS_API = 'http://localhost:8081';
const AUTHORS_API = 'http://localhost:8082';

interface Book { id: number; title: string; authorId: number; }
interface Author { id: number; name: string; nationality: string; }
interface Snack { open: boolean; message: string; severity: 'success' | 'error'; }

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [snack, setSnack] = useState<Snack>({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchBooks(); fetchAuthors(); }, []);

  async function fetchBooks() {
    try {
      const res = await fetch(`${BOOKS_API}/api/books`);
      if (!res.ok) throw new Error();
      setBooks(await res.json());
    } catch { notify('Erreur lors du chargement des livres', 'error'); }
    finally { setLoading(false); }
  }

  async function fetchAuthors() {
    try {
      const res = await fetch(`${AUTHORS_API}/api/authors`);
      if (!res.ok) throw new Error();
      setAuthors(await res.json());
    } catch { /* silent */ }
  }

  const getAuthorName = (id: number) => authors.find(a => a.id === id)?.name ?? `Auteur #${id}`;

  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

  async function handleAdd() {
    try {
      const res = await fetch(`${BOOKS_API}/api/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, authorId: parseInt(authorId) }),
      });
      if (!res.ok) throw new Error();
      const newBook = await res.json();
      setBooks(prev => [...prev, newBook]);
      setOpenAdd(false); reset();
      notify('Livre ajouté avec succès', 'success');
    } catch { notify("Erreur lors de l'ajout", 'error'); }
  }

  async function handleEdit() {
    if (!selected) return;
    try {
      const res = await fetch(`${BOOKS_API}/api/books/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, authorId: parseInt(authorId) }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
      setOpenEdit(false);
      notify('Livre modifié', 'success');
    } catch { notify('Erreur lors de la modification', 'error'); }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      const res = await fetch(`${BOOKS_API}/api/books/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setBooks(prev => prev.filter(b => b.id !== selected.id));
      setOpenDelete(false);
      notify('Livre supprimé', 'success');
    } catch { notify('Erreur lors de la suppression', 'error'); }
  }

  function openEditDialog(book: Book) {
    setSelected(book); setTitle(book.title); setAuthorId(String(book.authorId)); setOpenEdit(true);
  }
  function reset() { setTitle(''); setAuthorId(''); }
  function notify(message: string, severity: 'success' | 'error') {
    setSnack({ open: true, message, severity });
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1 }}>
            Catalogue
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {books.length} livre{books.length !== 1 ? 's' : ''} dans la collection
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { reset(); setOpenAdd(true); }}
          aria-label="Ajouter un livre"
          sx={{ bgcolor: 'primary.main', color: '#0B0907', fontWeight: 600, px: 2.5, '&:hover': { bgcolor: 'primary.light' } }}
        >
          Ajouter un livre
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Rechercher par titre…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        inputProps={{ 'aria-label': 'Rechercher' }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment> }}
        sx={{ mb: 3 }}
      />

      {/* Grid */}
      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={148} sx={{ bgcolor: '#1A1714', borderRadius: 1.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <MenuBookIcon sx={{ fontSize: 52, color: '#2C2721', mb: 1.5 }} />
          <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
            {search ? 'Aucun résultat pour cette recherche' : 'Aucun livre dans la collection'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map(book => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card sx={{
                height: '100%',
                borderLeft: '3px solid',
                borderLeftColor: 'primary.main',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 28px rgba(0,0,0,0.45)' },
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <MenuBookIcon sx={{ color: 'primary.main', fontSize: 18, mt: 0.3 }} />
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(book)}
                          aria-label={`Modifier ${book.title}`}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => { setSelected(book); setOpenDelete(true); }}
                          aria-label={`Supprimer ${book.title}`}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 600,
                    fontSize: '1rem',
                    lineHeight: 1.35,
                    mb: 2,
                    color: 'text.primary',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {book.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PersonOutlineIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                        {getAuthorName(book.authorId)}
                      </Typography>
                    </Box>
                    <Chip
                      label={`ID ${book.id}`}
                      size="small"
                      sx={{ bgcolor: '#2C2721', color: '#7A6B58', height: 20, fontSize: '0.7rem', ml: 'auto' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          Nouveau livre
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Titre" value={title} onChange={e => setTitle(e.target.value)} fullWidth required autoFocus />
          <TextField label="ID de l'auteur" type="number" value={authorId} onChange={e => setAuthorId(e.target.value)} fullWidth required />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenAdd(false)} sx={{ color: 'text.secondary' }}>Annuler</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!title || !authorId}
            sx={{ bgcolor: 'primary.main', color: '#0B0907', '&:hover': { bgcolor: 'primary.light' } }}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          Modifier le livre
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Titre" value={title} onChange={e => setTitle(e.target.value)} fullWidth required autoFocus />
          <TextField label="ID de l'auteur" type="number" value={authorId} onChange={e => setAuthorId(e.target.value)} fullWidth required />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenEdit(false)} sx={{ color: 'text.secondary' }}>Annuler</Button>
          <Button onClick={handleEdit} variant="contained" disabled={!title || !authorId}
            sx={{ bgcolor: 'primary.main', color: '#0B0907', '&:hover': { bgcolor: 'primary.light' } }}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
          Supprimer ce livre ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            « {selected?.title} » sera définitivement supprimé.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDelete(false)} sx={{ color: 'text.secondary' }}>Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))} variant="filled">
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
