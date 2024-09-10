import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Card, CardContent, Dialog, DialogContent, DialogActions } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { postMedia } from '../../services/api';

interface Media {
    id: number;
    file_path: string;
    type: string;
    created_at: string;
}

const MediaComponent: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Correctly fetching "id" from route params
    const [media, setMedia] = useState<Media[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [openDialog, setOpenDialog] = useState(false); // Modal open state
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null); // Selected image


    useEffect(() => {
        const fetchMedia = async () => {
            if (!id) {
                console.error('Post ID is undefined');
                return;
            }
            
            try {
                const response = await axios.get(`http://localhost:8000/api/posts/${id}/media`);
                setMedia(response.data);
            } catch (error) {
                console.error('Error fetching media:', error);
            }
        };

        fetchMedia();
    }, [id]);

    const handleClickOpen = (filePath: string) => {
        setSelectedMedia(filePath);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedMedia(null);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !id) return;

        const formData = new FormData();
        formData.append('media_file', file);

        try {
            await postMedia(Number(id), formData);

            alert('Media uploaded successfully');
            setFile(null);

            const response = await axios.get(`http://localhost:8000/api/posts/${id}/media`);
            setMedia(response.data);
        } catch (error) {
            console.error('Error uploading media:', error);
        }
    };

    return (
        <Box mt={4}>
            <Typography variant="h6" gutterBottom>Media Gallery</Typography>

            {/* File Upload Section */}
            <Box mb={2}>
                <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
                <Button onClick={handleUpload} variant="contained" color="primary" disabled={!file}>
                    Upload Media
                </Button>
            </Box>

            {/* Scrollable Media Gallery */}
            {media.length > 0 ? (
                <Box
                    sx={{
                        maxHeight: '710px',
                        overflowY: 'scroll',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <Grid container spacing={2}>
                        {media.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card>
                                    <CardContent>
                                        {item.type.startsWith('image') ? (
                                            <img
                                                src={`http://localhost:8000/storage/${item.file_path}`}
                                                alt="trail-media"
                                                style={{ width: '100%', height: 'auto', borderRadius: '8px', cursor: 'pointer', maxHeight: '550px' }}
                                                onClick={() => handleClickOpen(item.file_path)} // Open dialog on click
                                            />
                                        ) : (
                                            <video controls style={{ width: '100%', borderRadius: '8px', maxHeight: '550px' }}>
                                                <source src={`http://localhost:8000/storage/${item.file_path}`} type={item.type} />
                                            </video>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    No media available yet.
                </Typography>
            )}
            {/* Dialog for full-size image */}
            <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogContent>
                    {selectedMedia && (
                        <img
                            src={`http://localhost:8000/storage/${selectedMedia}`}
                            alt="Selected Media"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MediaComponent;
