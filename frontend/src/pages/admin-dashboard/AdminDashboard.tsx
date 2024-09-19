import React, { useEffect, useState } from 'react';
import { getPosts, getUsers, deletePostById, deleteUserById } from '../../services/api'; // Import API functions
import { Container, Grid, Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import './AdminDashboard.scss'; // You can create a custom SCSS file for further customizations;
import { useNavigate } from 'react-router-dom';
// Define the types for Post and User
interface Post {
    id: number;
    title: string;
    description: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

const AdminDashboard: React.FC = () => {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsResponse = await getPosts();
                const usersResponse = await getUsers();

                // If the user doesn't have privileges, show error
                if (postsResponse.status === 403 || usersResponse.status === 403) {
                    setErrorMessage('You do not have admin privileges.');
                    return;
                }

                // Assuming the API response contains a `posts` and `users` array inside `data`
                setPosts(postsResponse.posts);
                setUsers(usersResponse.users);

                console.log('Posts Data:', postsResponse);
                console.log('Users Data:', usersResponse);
            } catch (error: any) {
                console.error('Error fetching data:', error);

                // Check if it's a 403 error
                if (error.response?.status === 403) {
                    setErrorMessage('You do not have admin privileges.');
                } else {
                    setErrorMessage('You do not have admin privileges.');
                }
            } finally {
                setLoadingPosts(false);
                setLoadingUsers(false);
            }
        };
        fetchData();
    }, []);

    // If there's an error message, display it
    if (errorMessage) {
        return (
            <Container>
                <Typography variant="h5" color="error" align="center">
                    {errorMessage}
                </Typography>
            </Container>
        );
    }

    // Function to delete a post
    const handleDeletePost = async (id: number) => {
        try {
            await deletePostById(id);
            if (posts) {
                setPosts(posts.filter(post => post.id !== id));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Function to delete a user
    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUserById(id);
            if (users) {
                setUsers(users.filter(user => user.id !== id));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleViewPost = (id: number) => {
        navigate(`/posts/${id}`); // Navigate to the post details page
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom align="center">
                Admin Dashboard
            </Typography>

            <Grid container spacing={4}>
                {/* Posts Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Posts
                    </Typography>
                    {loadingPosts ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : posts && posts.length > 0 ? (
                        posts.map(post => (
                            <Card key={post.id} sx={{ marginBottom: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{post.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {post.description}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        Delete Post
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewPost(post.id)} // Navigate to the post details page
                                    >
                                        View Post
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No posts available
                        </Typography>
                    )}
                </Grid>

                {/* Users Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Users
                    </Typography>
                    {loadingUsers ? (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : users && users.length > 0 ? (
                        users.map(user => (
                            <Card key={user.id} sx={{ marginBottom: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{user.name}</Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {user.email}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete User
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No users available
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
