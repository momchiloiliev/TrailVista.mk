import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import './CommentSection.scss';

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

    const handleSubmit = async () => {
        if (!newComment) {
            alert('Please add a comment or upload a file');
            return;
        }

        try {
            // Get the CSRF token if needed
            await axios.get('http://localhost:8000/sanctum/csrf-cookie');

            // Send the new comment to the server
            const response = await axios.post(`http://localhost:8000/api/posts/${trailId}/comments`, {
                content: newComment,
            });

            // Add the newly created comment (with author_name and content) to the state
            setComments([...comments, response.data]);

            // Clear the new comment input field
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

            {/* Scrollable comment list */}
            <Box className="comments-list" mt={2}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <Card key={comment?.id} className="comment-card" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1">
                                    {comment?.author_name || 'Anonymous'}
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
