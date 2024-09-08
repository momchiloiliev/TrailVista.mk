import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography, Stack, Divider, List, ListItem, ListItemText, responsiveFontSizes } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.scss';
import { getCurrentUser } from '../../services/api';

interface Trail {
    id: number;
    title: string;
    description: string;
    moderation_status: string;
}

const Profile: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<string>();
    // const { user, loading } = useAuth() as { user: any, loading: any };
    const navigate = useNavigate();
  
    // useEffect(() => {
    //   console.log("user1:" +user);
    //   if (!loading && !user) {
    //     console.log("user2:" +user);
    //     // navigate('/login');
    //   } else if (user) {
    //     console.log("user3:" +user);
    //     getRating();
    //   }
    // }, [user, loading, navigate]);
  

  const getUserData = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response);
      console.log(user);
      return response.data;
    } catch (error) {
      console.log(error);
    }

}
    getUserData();
   
    // if (loading) return <Typography>Loading...</Typography>;
    // if (!user) return null;
    // if (error) return <Typography color="error">{error}</Typography>;
  
    const profilePictureUrl =  'path_to_default_profile_picture';
  
    // const calculateAge = (birthDate: string): number | null => {
    //   if (!birthDate) return null;
    //   const birthYear = new Date(birthDate).getFullYear();
    //   return new Date().getFullYear() - birthYear;
    // };
  
    // const age = calculateAge(user.birth_date);
    // const formattedYear = user.created_at ? new Date(user.created_at).getFullYear() : t("YEAR");
  
    return (
      <Card sx={{ maxWidth: 700, maxHeight: 700, margin: 'auto', padding: 2, backgroundColor: "#F1F1F1" }}>
        <Stack direction="row" spacing={2} alignItems="center" ml={6}>
          <Avatar
            src={profilePictureUrl}
            alt="Profile"
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            {/* <Typography variant="h6">{user.name || 'User Name'}</Typography> */}
            <Typography variant="body2" color="text.secondary">
              {/* {age ? `${age} years` :'Age not available'} */}
            </Typography>
          </Box>
        </Stack>
        <CardContent>
          <Box mb={2} ml={4}>
            <Typography variant="h6" mb={3}>Profile Info:</Typography>
            {/* <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <img src={verifiedIcon} alt="Verified" width={20} />
              <Typography variant="body2">{user.is_verified ? t('VERIFIED_PROFILE') : t('UNVERIFIED_PROFILE')}</Typography>
            </Stack> */}
            {/* <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <img src={infoMessageIcon} alt="Info Message" width={20} />
              <Typography variant="body2">{user.bio || t('DEFAULT_MSG')}</Typography>
            </Stack> */}
            {/* <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <img src={phoneIcon} alt="Phone" width={20} />
              <Typography variant="body2">{user.phone_number || t('HIDDEN')}</Typography>
            </Stack> */}
            {/* <Stack direction="row" spacing={2} alignItems="center">
              <img src={locationIcon} alt="Location" width={20} />
              <Typography variant="body2">{user.location || t('HIDDEN')}</Typography>
            </Stack> */}
          </Box>
          <Divider sx={{ borderBottomWidth: 4 }} />
          <Box mb={2} ml={4} mt={5}>
            <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }} mb={1}>
              {/* <img src={carIcon} width={20} alt="Car Icon" /> */}
              {/* <span style={{ marginLeft: '4px' }}>{user.completed_rides || '0'} {t('RIDES')}</span> */}
            </Typography>
            <Typography variant="body2" style={{ display: 'flex', alignItems: 'center' }} mb={3}>
              {/* <img src={starIcon} width={20} alt="Star" /> */}
              {/* <span style={{ marginLeft: '4px' }}>{userRating.toFixed(1) || '0.0'}</span>1 */}
            </Typography>
            <Divider sx={{ borderBottomWidth: 2 }} />
            <Stack direction="row" spacing={2} alignItems="center" mb={2} mt={2}>
              {/* <img src={lightningIcon} alt="Member Since" width={10} /> */}
              {/* <Typography variant="body2">{t('MEMBER-SINCE')} {formattedYear || 'YEAR'}</Typography> */}
            </Stack>
            <Divider sx={{ borderBottomWidth: 2 }} />
            <Button onClick={() => navigate('/profile-edit')} variant="contained" color="error">Edit</Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default Profile;
