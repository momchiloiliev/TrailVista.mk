import React, { useState, useEffect } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Grid
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import HikingIcon from '@mui/icons-material/Hiking';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HeightIcon from '@mui/icons-material/Height';
import MapIcon from '@mui/icons-material/Map';
import './Profile.scss';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/api';

interface Posts {
    id: number;
    title: string;
    description: string;
    moderation_status: string;
    distance: string;
    elevation: string;
    time: string;
    sport: string;
    created_at: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    total_posts: number;
    posts: Posts[];
}

const Profile: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await getCurrentUser();
                setUser(response);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError('Error fetching user data');
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    const profilePictureUrl = 'path_to_default_profile_picture';

    const handlePostClick = (postId: number) => {
        navigate(`/posts/${postId}`);
    };

    const sportIcon = (sport: string) => {
        switch (sport) {
            case 'running':
                return <DirectionsRunIcon />;
            case 'hiking':
                return <HikingIcon />;
            case 'biking':
                return <DirectionsBikeIcon />;
            default:
                return <MapIcon />;
        }
    };

    return (
        <Card sx={{ maxWidth: 900, margin: 'auto', marginTop: 5 ,marginBottom: 5, padding: 3, backgroundColor: "#F9F9F9", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
            <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                    src={profilePictureUrl}
                    alt="Profile"
                    sx={{ width: 90, height: 90 }}
                />
                <Box>
                    <Typography variant="h5" fontWeight="bold">{user?.name || 'User Name'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Member since {new Date(user?.created_at || '').getFullYear()}
                    </Typography>
                </Box>
            </Stack>
            <CardContent>
                <Box mb={2} mt={4}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>Profile Info:</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Email: {user?.email || 'Email not available'}
                    </Typography>
                </Box>
                <Divider sx={{ borderBottomWidth: 4, mb: 4 }} />
                <Box mb={2}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>Posted Routes({user?.total_posts|| 0}):</Typography>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto', paddingRight: 1 }}> {/* Scrollable box */}
                        {user?.posts && user.posts.length ? (
                            <Grid container spacing={3}>
                                {user.posts.map((post) => (
                                    <Grid item xs={12} sm={6} key={post.id}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                padding: 2,
                                                cursor: 'pointer',
                                                '&:hover': { boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }
                                            }}
                                            onClick={() => handlePostClick(post.id)}
                                        >
                                            <Typography variant="h6" fontWeight="bold" mb={1}>
                                                {post.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mb={2}>
                                                {post.description || 'No description available'}
                                            </Typography>
                                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                                {sportIcon(post.sport)}
                                                <Typography variant="body2">{post.sport}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                                <HeightIcon />
                                                <Typography variant="body2">Elevation: {post.elevation} m</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                                <AccessTimeIcon />
                                                <Typography variant="body2">Time: {post.time}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                                <MapIcon />
                                                <Typography variant="body2">Distance: {post.distance} km</Typography>
                                            </Stack>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No routes posted yet.
                            </Typography>
                        )}
                    </Box>
                    <Divider sx={{ borderBottomWidth: 2, mt: 4 }} />
                    <Button onClick={() => navigate('/profile-edit')} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Edit Profile
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Profile;
