import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import { FiUpload } from 'react-icons/fi';
import './CommentSection.scss';
import { getComments } from '../../services/api';

interface Comment {
    id?: number;
    author_name?: string;
    content?: string;
}

interface CommentSectionProps {
    trailId: number; // Pass the trail ID to fetch related comments
}

const CommentSection: React.FC<CommentSectionProps> = ({ trailId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');

    // Fetch comments when the component mounts
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/posts/${trailId}/comments`); // Correct the URL here
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [trailId]);

    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };
    axios.defaults.withCredentials = true;
    const fetchCsrfToken = async () => {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');
    };

    const handleSubmit = async () => {
        if (!newComment) {
            alert('Please add a comment or upload a file');
            return;
        }

        const formData = new FormData();
        formData.append('content', newComment);  // Use 'content' instead of 'comment'

        try {
            const response = await getComments(trailId, formData);
            setComments([...comments, response.data]); // Add the new comment to the list
            setNewComment('');
            const fetchComments = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/posts/${trailId}/comments`); // Correct the URL here
                    setComments(response.data);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                }
            };

            fetchComments();
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <Box className="comment-section">
            <Typography variant="h5" gutterBottom padding={2}>
                Comment Section
            </Typography>

            {/* New Comment Form */}
            <Box className="new-comment-box" mt={2}>
                <TextField
                    className='leave-comment'
                    label="Leave a comment"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={newComment}
                    onChange={handleCommentChange}
                    sx={{
                        mb: 2,
                        // Change label color when focused
                        '& label.Mui-focused': {
                            color: 'green',
                        },
                        // Optional: Change label color on hover
                        '& label:hover': {
                            color: 'darkgreen',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'green', // Default border color
                            },
                            '&:hover fieldset': {
                                borderColor: 'darkgreen', // Border color when hovering
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'green', // Border color when focused
                            },
                        },
                    }}
                />

                {/* Submit Button */}
                <Button variant="contained" color="success" onClick={handleSubmit} sx={{ mt: 2 }} className='submit-comment'>
                    Submit
                </Button>
            </Box>

            {/* Render the comments */}
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Card key={comment?.id} className="comment-card" sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1">
                                {comment?.author_name}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {comment?.content}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No comments yet. Be the first to comment!</Typography>
            )}

        </Box>
    );
};

export default CommentSection;
