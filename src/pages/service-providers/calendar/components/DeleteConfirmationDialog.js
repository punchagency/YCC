import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    useTheme,
    alpha,
} from '@mui/material';
import {
    Close as CloseIcon,
    DeleteForever as DeleteIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';

const DeleteConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    event,
    isDeleting = false,
}) => {
    const theme = useTheme();

    if (!event) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                elevation: 5,
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden',
                },
            }}
        >
            <DialogTitle
                sx={{
                    bgcolor: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                    color: theme.palette.mode === 'light' ? '#333' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 2,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                        Delete Event
                    </Typography>
                </Box>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                    disabled={isDeleting}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, mt: 1, '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.error.main, 0.2), borderRadius: '4px' } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <WarningIcon
                        color="warning"
                        sx={{
                            fontSize: 40,
                            mr: 2,
                            mt: 0.5,
                        }}
                    />
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Are you sure you want to delete this event?
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            "{event.title}"
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            This action cannot be undone.
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ 
                px: 3, 
                py: 2, 
                bgcolor: theme.palette.mode === 'light' ? alpha('#fff5f5', 0.8) : alpha('#2c1c1c', 0.8),
                borderTop: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={onConfirm}
                    disabled={isDeleting}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.4)',
                        },
                    }}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Event'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
