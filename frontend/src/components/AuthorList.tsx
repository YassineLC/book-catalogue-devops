import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton,
  TextField, Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Chip, Snackbar, Alert,
  InputAdornment, Skeleton, Tooltip, Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PublicIcon from '@mui/icons-material/Public';

const AUTHORS_API = 'http://localhost:8082';

interface Author { id: number; name: string; nationality: string; }
interface Snack { open: boolean; message: string; severity: 'success' | 'error'; }

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function avatarColor(name: string) {
  const colors = ['#8B6914', '#6B4E2A', '#5A3E28', '#7A5C1E', '#4A3520'];
  let hash = 0;
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function AuthorList() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<Author | null>(null);
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [snack, setSnack] = useState<Snack>({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchAuthors(); }, []);

  async function fetchAuthors() {
    try {
      const res = await fetch(`${AUTHORS_API}/api/authors`);
      if (!res.ok) throw new Error();
      setAuthors(await res.json());
    } catch { notify('Erreur lors du chargement des auteurs', 'error'); }
    finally { setLoading(false); }
  }

  const filtered = authors.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.nationality.toLowerCase().includes(search.toLowerCase())
  );

  async function handleAdd() {
    try {
      const res = await fetch(`${AUTHORS_API}/api/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nationality }),
      });
      if (!res.ok) throw new Error();
      const newAuthor = await res.json();
      setAuthors(prev => [...prev, newAuthor]);
      setOpenAdd(false); reset();
      notify('Auteur ajouté avec succès', 'success');
    } catch { notify("Erreur lors de l'ajout", 'error'); }
  }

  async function handleEdit() {
    if (!selected) return;
    try {
      const res = await fetch(`${AUTHORS_API}/api/authors/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nationality }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setAuthors(prev => prev.map(a => a.id === updated.id ? updated : a));
      setOpenEdit(false);
      notify('Auteur modifié', 'success');
    } catch { notify('Erreur lors de la modification', 'error'); }
  }

  async function handleDelete() {
    if (!selected) return;
    try {
      const res = await fetch(`${AUTHORS_API}/api/authors/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setAuthors(prev => prev.filter(a => a.id !== selected.id));
      setOpenDelete(false);
      notify('Auteur supprimé', 'success');
    } catch { notify('Erreur lors de la suppression', 'error'); }
  }

  function openEditDialog(author: Author) {
    setSelected(author); setName(author.name); setNationality(author.nationality); setOpenEdit(true);
  }
  function reset() { setName(''); setNationality(''); }
  function notify(message: string, severity: 'success' | 'error') {
    setSnack({ open: true, message, severity });
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1 }}>
            Auteurs
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {authors.length} auteur{authors.length !== 1 ? 's' : ''} enregistré{authors.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { reset(); setOpenAdd(true); }}
          aria-label="Ajouter un auteur"
          sx={{ bgcolor: 'primary.main', color: '#0B0907', fontWeight: 600, px: 2.5, '&:hover': { bgcolor: 'primary.light' } }}
        >
          Ajouter un auteur
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Rechercher par nom ou nationalité…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        inputProps={{ 'aria-label': 'Rechercher auteur' }}
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
          <PeopleOutlineIcon sx={{ fontSize: 52, color: '#2C2721', mb: 1.5 }} />
          <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
            {search ? 'Aucun résultat pour cette recherche' : 'Aucun auteur enregistré'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map(author => (
            <Grid item xs={12} sm={6} md={4} key={author.id}>
              <Card sx={{
                height: '100%',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 28px rgba(0,0,0,0.45)' },
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{
                      width: 42, height: 42,
                      bgcolor: avatarColor(author.name),
                      color: '#E8B84B',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      fontFamily: '"DM Sans", sans-serif',
                      border: '1px solid #2C2721',
                    }}>
                      {initials(author.name)}
                    </Avatar>
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(author)}
                          aria-label={`Modifier ${author.name}`}
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => { setSelected(author); setOpenDelete(true); }}
                          aria-label={`Supprimer ${author.name}`}
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
                    mb: 1.5,
                    color: 'text.primary',
                  }}>
                    {author.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PublicIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                    <Chip
                      label={author.nationality}
                      size="small"
                      sx={{ bgcolor: 'rgba(201,150,61,0.10)', color: '#C9963D', height: 22, fontSize: '0.72rem', border: '1px solid rgba(201,150,61,0.2)' }}
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
          Nouvel auteur
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Nom" value={name} onChange={e => setName(e.target.value)} fullWidth required autoFocus />
          <TextField label="Nationalité" value={nationality} onChange={e => setNationality(e.target.value)} fullWidth required />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenAdd(false)} sx={{ color: 'text.secondary' }}>Annuler</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!name || !nationality}
            sx={{ bgcolor: 'primary.main', color: '#0B0907', '&:hover': { bgcolor: 'primary.light' } }}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, pb: 1 }}>
          Modifier l'auteur
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Nom" value={name} onChange={e => setName(e.target.value)} fullWidth required autoFocus />
          <TextField label="Nationalité" value={nationality} onChange={e => setNationality(e.target.value)} fullWidth required />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenEdit(false)} sx={{ color: 'text.secondary' }}>Annuler</Button>
          <Button onClick={handleEdit} variant="contained" disabled={!name || !nationality}
            sx={{ bgcolor: 'primary.main', color: '#0B0907', '&:hover': { bgcolor: 'primary.light' } }}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
          Supprimer cet auteur ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            « {selected?.name} » sera définitivement supprimé.
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
