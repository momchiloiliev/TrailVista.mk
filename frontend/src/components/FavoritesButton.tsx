import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '@mui/material';
// import { addToFavorites, removeFromFavorites } from '../../../services/api';
import { addToFavorites, removeFromFavorites } from '../services/api';

interface FavoriteButtonProps {
    postId: number;
    isFavorited: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ postId, isFavorited }) => {
    const [favorited, setFavorited] = useState(isFavorited);

    const handleFavoriteToggle = async () => {
        try {
            if (favorited) {
                await removeFromFavorites(postId);
                setFavorited(false);
            } else {
                await addToFavorites(postId);
                setFavorited(true);
            }
        } catch (error) {
            console.error('Error toggling favorite', error);
        }
    };

    return (
        <IconButton onClick={handleFavoriteToggle}>
            {favorited ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
    );
};

export default FavoriteButton;