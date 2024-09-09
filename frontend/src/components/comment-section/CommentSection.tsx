import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import './CommentSection.scss';
import { getComments } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
    const { user } = useAuth();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/posts/${trailId}/comments`);
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
        formData.append('content', newComment);

        try {
            const response = await getComments(trailId, formData);
            setComments([...comments, response]);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <Box className="comment-section">
            <Typography variant="h5" gutterBottom padding={2}>
                Comment Section
            </Typography>

            
                <Box className="new-comment-box" mt={2}>
                    <TextField
                        className="leave-comment"
                        label="Leave a comment"
                        variant="outlined"
                        fullWidth
                        multiline
                        disabled={!user}
                        rows={3}
                        value={newComment}
                        onChange={handleCommentChange}
                        sx={{
                            mb: 2,
                            '& label.Mui-focused': {
                                color: 'green',
                            },
                            '& label:hover': {
                                color: 'darkgreen',
                            },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'green',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'darkgreen',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'green',
                                },
                            },
                        }}
                    />
                    {user && <Button variant="contained" color="success" onClick={handleSubmit} sx={{ mt: 2 }} className="submit-comment">
                        Submit
                    </Button>}
                </Box>

            <Box className="comments-list" mt={2}>
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
        </Box>
    );
};

export default CommentSection;
