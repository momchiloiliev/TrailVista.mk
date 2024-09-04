import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography, Stack, Divider, List, ListItem, ListItemText, responsiveFontSizes } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.scss';

interface Trail {
    id: number;
    title: string;
    description: string;
    moderation_status: string;
}

const Profile: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [userTrails, setUserTrails] = useState<any[]>([]); // State for storing the user's trails
    //   const { user, loading } = useAuth() as { user: any, loading: any };

    const navigate = useNavigate();


    //   useEffect(() => {
    //     if (!user) {
    //       navigate('/login');
    //     } else {
    //       fetchUserTrails();
    //     }
    //   }, [user, loading, navigate]);

    // Fetch the user's trails from the backend
    //   const fetchUserTrails = async () => {
    //     try {
    //       const response = await axios.get(`http://localhost:8000/api/user-trails/${user.id}`); // Adjust endpoint if needed
    //       setUserTrails(response.data);
    //     } catch (error: any) {
    //       setError(error.message);
    //     }
    //   };

    //   if (loading) return <Typography>Loading...</Typography>;
    //   if (!user) return null;
    if (error) return <Typography color="error">{error}</Typography>;


    return (
        <Box className="profile-box">
        <Card className="profile-card">
            <CardContent>
                <Box className="profile-details">
                    <Typography variant="h6">Profile Info:</Typography>
                    <Typography variant="subtitle2">Test UserName</Typography>
                    {/* <Box className="profile-info">
                      <Typography variant="h6">{user.name || 'User Name'}</Typography>
                     </Box> * */}
                    {/* User Info and Trails */}
                </Box>

                <Divider sx={{ borderBottomWidth: 4, paddingTop: '10px' }} />
                
                {/* Trails List */}
                <Box className="profile-details">
                    <Typography variant="h6" >Your Trails:</Typography>
                    {/* User Info and Trails */}
                </Box>
                {/* <List className="trails-list">
                    {userTrails.map((trail) => (
                        <ListItem key={trail.id} className="trail-item">
                            <ListItemText primary={trail.title} secondary={trail.description} />
                        </ListItem>
                    ))}
                </List> */}

                <Divider sx={{ borderBottomWidth: 4 }} />

                {/* Edit Profile Button
                <Box className="edit-profile-btn">
                    <Button onClick={() => navigate('/profile-edit')} variant="contained">
                        Edit Profile
                    </Button>
                </Box> */}
            </CardContent>
        </Card>
        </Box>
    );
};

export default Profile;
