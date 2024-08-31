import React from "react";
import { Box, Typography } from "@mui/material";
import HomePageLogo from '../../shared/images/home-page.png';
import './Home.scss';
import Bike from '../../shared/images/bike.png';
import Hiking from '../../shared/images/hiking-trail.png';
import River from '../../shared/images/river-trail.png';

export const Home = () => {

    return (
        <Box id='homepage-container'>
            <Box className='logo-container'>
                <Typography variant='h3' className='title'>
                    LET YOUR ADVENTURE BEGIN HERE
                </Typography>
                <Box className='grid-container'>
                    <Box className='text-content'>
                        <Typography variant='h3' className='home-title'>
                            Embark on Every Journey
                        </Typography>
                        <Typography variant='h3' className='home-text'>
                            From winding mountain paths to hidden forest trails, TrailVista.mk guides you through every twist and turn, taking you to the peaks and valleys of your next adventure.              
                        </Typography>
                        {/* <Typography variant='h3' className="home-text">
                            taking you to the peaks and valleys of your next adventure.  
                        </Typography> */}
                    </Box>
                    <Box className='image-content'>
                        <img src={HomePageLogo} alt='home-page-logo' className='home-page-logo' />
                    </Box>
                </Box>
            </Box>

            <Box className='infocards-container'>
                <Box className='infocard'>
                    <img src={Bike} alt='bike-icon' className='infocard-icon' />
                    <Typography variant='h6' className='infocard-title'>
                        Explore the Best Trails
                    </Typography>
                    <Typography className='infocard-text'>
                        Whether you're biking through the city or the countryside, discover the top-rated trails that suit your style and pace.
                    </Typography>
                </Box>

                <Box className='infocard'>
                    <img src={Hiking} alt='hiking-icon' className='infocard-icon' />
                    <Typography variant='h6' className='infocard-title'>
                        Conquer Every Trail
                    </Typography>
                    <Typography className='infocard-text'>
                        From gentle walks to challenging hikes, explore trails that offer breathtaking views and unforgettable experiences.
                    </Typography>
                </Box>

                <Box className='infocard'>
                    <img src={River} alt='river-icon' className='infocard-icon' />
                    <Typography variant='h6' className='infocard-title'>
                        Just Ride and Explore
                    </Typography>
                    <Typography className='infocard-text'>
                        With just a few taps, uncover new trails and set off on your next outdoor adventure with ease.
                    </Typography>
                </Box>
            </Box>

            <Box className='ai-info-container'>
                <Box className={'ai-info-content'}>
                    <img src={River} className='robot-image' alt='shtop-ai' />
                    <Typography variant='h4' className='ai-text'>
                        Discover TrailVista.mk and our routes and find your perfect trail to follow!
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
