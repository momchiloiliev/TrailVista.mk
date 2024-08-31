import React from 'react';
import { Grid, Link, Typography } from "@mui/material";
import './footer.scss';
import Logo from '../../shared/images/logo.png';

export const Footer = () => {

    const popularRoutes = [
        { text: `Sermenin > Smrdliva`, from: 'Sermenin', to: 'Smrdliva' },
        { text: `Sermenin > Smrdliva`, from: 'Sermenin', to: 'Smrdliva' },
        { text: `Sermenin > Smrdliva`, from: 'Sermenin', to: 'Smrdliva' },
        { text: `Sermenin > Smrdliva`, from: 'Sermenin', to: 'Smrdliva' },
        { text: `Sermenin > Smrdliva`, from: 'Sermenin', to: 'Smrdliva' }
    ];

    const aboutUsElements = [
        { text: "About Us", path: 'about-us' },
        { text: "How We Work", path: 'how-we-work' },
        { text: "Help Center", path: 'help-center' }
    ];

    return (
        <Grid container xs={12} id='footer-container'>
            <Grid item xs={12} lg={4} className='footer-element-container logos'>
                <Link href={'/'}>
                    <img src={Logo} alt='trailvista' className='logo' />
                </Link>
            </Grid>
            <Grid item xs={12} lg={4} className='footer-element-container links'>
                <Typography className='footer-element-title' variant='h4'>Most Popular Routes</Typography>
                {popularRoutes.map((route, index) => (
                    <Link key={index} className='footer-element-text' variant='h5' href={`search-route?from=${route.from}&to=${route.to}`}>
                        {route.text}
                    </Link>
                ))}
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
}
