import React, { useState, useEffect } from 'react';
import { 
  getComments, 
  updateCommentApproval, 
  deleteComment 
} from '../../services/commentsApiService';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments();
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApprovalToggle = async (comment) => {
    try {
      const newApprovalStatus = comment.IsApproved === 'true' ? 'false' : 'true';
      await updateCommentApproval(comment.Id, newApprovalStatus);
      setComments(comments.map(c => 
        c.Id === comment.Id ? { ...c, IsApproved: newApprovalStatus } : c
      ));
    } catch (err) {
      console.error('Error updating approval status:', err);
      setError('Failed to update approval status');
    }
  };

  const handleDeleteClick = (comment) => {
    setSelectedComment(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteComment(selectedComment.Id);
      setComments(comments.filter(c => c.Id !== selectedComment.Id));
      setDeleteDialogOpen(false);
      setSelectedComment(null);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedComment(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" color="primary" onClick={fetchComments} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Comments Management
      </Typography>
      <Typography variant="body1" paragraph>
        Approve, reject, or delete comments submitted by users.
      </Typography>
      
      <Grid container spacing={3}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Grid item xs={12} key={comment.Id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">
                      {comment.Author} - {comment.TechnologyLabel}
                    </Typography>
                    <Chip 
                      label={comment.IsApproved === 'true' ? 'Approved' : 'Not Approved'} 
                      color={comment.IsApproved === 'true' ? 'success' : 'warning'} 
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {comment.Email} • {format(new Date(comment.CommentDate), 'MMM d, yyyy HH:mm')}
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ py: 1 }}>
                    {comment.Text}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button 
                      variant="contained" 
                      color={comment.IsApproved === 'true' ? 'warning' : 'success'}
                      onClick={() => handleApprovalToggle(comment)}
                    >
                      {comment.IsApproved === 'true' ? 'Unapprove' : 'Approve'}
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleDeleteClick(comment)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">No comments found.</Typography>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
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

export default CommentsManagement;
