import React, { useState, useEffect } from 'react';
import { Grid, Link, Typography } from "@mui/material";
import './Footer.scss';
import Logo from '../../shared/images/logo.png';
import { getFavorites, getMostFavorites } from '../../services/api';  // Import the API function

interface Route {
    id: number;
    title: string;
    from: string;
    to: string;
}

export const Footer = () => {
    const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);

    // Fetch the top 5 favorited routes
    useEffect(() => {
        const fetchPopularRoutes = async () => {
            try {
                const response = await getMostFavorites(); // API call
                setPopularRoutes(response);
            } catch (error) {
                console.error('Error fetching popular routes:', error);
            }
        };

        fetchPopularRoutes();
    }, []);

    const aboutUsElements = [
        { text: "About Us", path: 'about-us' },
        { text: "How We Work", path: 'how-we-work' },
        { text: "Help Center", path: 'help-center' }
    ];

    return (
        <Grid item container xs={12} id='footer-container'>
            <Grid item xs={12} lg={4} className='footer-element-container logos'>
                <Link href={'/'}>
                    <img src={Logo} alt='trailvista' className='logo' />
                </Link>
            </Grid>
            <Grid item xs={12} lg={4} className='footer-element-container links'>
                <Typography className='footer-element-title' variant='h4'>Most Popular Trails</Typography>
                {popularRoutes?.length ? (
                    popularRoutes.map((route, index) => (
                        <Link
                            key={index}
                            className='footer-element-text'
                            variant='h5'
                            href={`/posts/${route.id}`}  // Assuming the post URL is by ID
                        >
                            {route.title}
                        </Link>
                    ))
                ) : (
                    <Typography variant="body2">No popular trails available</Typography>
                )}
            </Grid>
            <Grid item xs={12} lg={4} className='footer-element-container links'>
                <Typography className='footer-element-title' variant='h4'>About Us</Typography>
                {aboutUsElements.map((element, index) => (
                    <Link key={index} href={element.path} variant='h5' className='footer-element-text'>
                        {element.text}
                    </Link>
                ))}
            </Grid>
        </Grid>
    );
};
