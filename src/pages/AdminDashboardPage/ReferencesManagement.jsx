import React, { useState, useEffect } from 'react';
import { 
  getReferences, 
  createReference,
  updateReference,
  deleteReference 
} from '../../services/commentsApiService';
import { 
  Box, 
  Button, 
  Card, 
  CardContent,
  CardMedia,
  Typography, 
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const initialFormState = {
  TechnologyLabel: '',
  Title: '',
  Url: '',
  Source: '',
  PublicationDate: '',
  ImageUrl: ''
};

const ReferencesManagement = () => {
  const [references, setReferences] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchReferences = async () => {
    try {
      setLoading(true);
      const data = await getReferences();
      setReferences(data);
      
      // Extract unique technology labels for dropdown
      const uniqueLabels = [...new Set(data.map(ref => ref.TechnologyLabel))];
      setTechnologies(uniqueLabels);
      
      setError(null);
    } catch (err) {
      setError('Failed to load references. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.TechnologyLabel.trim()) errors.TechnologyLabel = 'Technology label is required';
    if (!formData.Title.trim()) errors.Title = 'Title is required';
    if (!formData.Url.trim()) errors.Url = 'URL is required';
    else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(formData.Url)) {
      errors.Url = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleAddClick = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditClick = (reference) => {
    setFormData({
      ...reference,
      PublicationDate: reference.PublicationDate 
        ? format(new Date(reference.PublicationDate), 'yyyy-MM-dd')
        : ''
    });
    setIsEditing(true);
    setSelectedReference(reference);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormErrors({});
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        const updated = await updateReference(selectedReference.Id, formData);
        setReferences(references.map(ref => 
          ref.Id === selectedReference.Id ? updated : ref
        ));
      } else {
        const created = await createReference(formData);
        setReferences([...references, created]);
      }
      setDialogOpen(false);
      setFormData(initialFormState);
    } catch (err) {
      console.error('Error saving reference:', err);
      setError('Failed to save reference');
    }
  };

  const handleDeleteClick = (reference) => {
    setSelectedReference(reference);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReference(selectedReference.Id);
      setReferences(references.filter(ref => ref.Id !== selectedReference.Id));
      setDeleteDialogOpen(false);
      setSelectedReference(null);
    } catch (err) {
      console.error('Error deleting reference:', err);
      setError('Failed to delete reference');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedReference(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">References Management</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Reference
        </Button>
      </Box>

      {error && (
        <Box mb={3}>
          <Typography color="error">{error}</Typography>
          <Button variant="contained" color="primary" onClick={fetchReferences} sx={{ mt: 1 }}>
            Try Again
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {references.length > 0 ? (
          references.map((reference) => (
            <Grid item xs={12} md={6} lg={4} key={reference.Id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {reference.ImageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={reference.ImageUrl}
                    alt={reference.Title}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png'; // Fallback image
                      e.target.onerror = null;
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="overline" color="textSecondary">
                    {reference.TechnologyLabel}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {reference.Title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Source: {reference.Source}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {reference.PublicationDate && (
                      <>Published: {format(new Date(reference.PublicationDate), 'MMM d, yyyy')}</>
                    )}
                  </Typography>
                  <Box mt={2}>
                    <Button 
                      href={reference.Url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      size="small"
                    >
                      Visit Link
                    </Button>
                  </Box>
                </CardContent>
                <Box display="flex" justifyContent="flex-end" p={1}>
                  <Button 
                    startIcon={<EditIcon />} 
                    size="small" 
                    onClick={() => handleEditClick(reference)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button 
                    startIcon={<DeleteIcon />} 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteClick(reference)}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">No references found.</Typography>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Reference Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Reference' : 'Add New Reference'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.TechnologyLabel}>
                <InputLabel id="technology-label">Technology</InputLabel>
                <Select
                  labelId="technology-label"
                  name="TechnologyLabel"
                  value={formData.TechnologyLabel}
                  onChange={handleInputChange}
                  label="Technology"
                >
                  {technologies.map(tech => (
                    <MenuItem key={tech} value={tech}>{tech}</MenuItem>
                  ))}
                </Select>
                {formErrors.TechnologyLabel && (
                  <Typography color="error" variant="caption">
                    {formErrors.TechnologyLabel}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="Title"
                label="Title"
                fullWidth
                value={formData.Title}
                onChange={handleInputChange}
                error={!!formErrors.Title}
                helperText={formErrors.Title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="Url"
                label="URL"
                fullWidth
                value={formData.Url}
                onChange={handleInputChange}
                error={!!formErrors.Url}
                helperText={formErrors.Url}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="Source"
                label="Source"
                fullWidth
                value={formData.Source || ''}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="PublicationDate"
                label="Publication Date"
                type="date"
                fullWidth
                value={formData.PublicationDate || ''}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="ImageUrl"
                label="Image URL"
                fullWidth
                value={formData.ImageUrl || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Reference</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reference? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReferencesManagement;
