import React, { useState } from 'react';
import {
    Drawer,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    Typography,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Header.scss';
import Logo from '../../shared/images/logo.png';

export const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:1200px)');

    const headerElements = [
        { text: 'Browse Trails', href: '/browse-trails' },
        { text: 'Trail Planner ', href: '/trail-planner' },
        { text: 'Features', href: '/features' }
    ];

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Tab') {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <Grid container alignItems="center" id='header-container'>
            <Grid item xs={6} lg={2}>
                <Link href='/'>
                    <img src={Logo} alt='logo' className='logo' />
                </Link>
            </Grid>
            {isMobile ? (
                <>
                    <Grid item xs={6} style={{ textAlign: 'right' }}>
                        <IconButton onClick={toggleDrawer(true)} size="large">
                            <MenuIcon style={{ fontSize: '1.5rem' }} />
                        </IconButton>
                    </Grid>
                    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                        <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} style={{ width: 250 }}>
                            {headerElements.map((headerElement, index) => (
                                <ListItem style={{ padding: '8px 16px' }} key={index}>
                                    <Link href={headerElement.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography variant='h6'>{headerElement.text}</Typography>
                                    </Link>
                                </ListItem>
                            ))}
                            <ListItem style={{ padding: '8px 16px' }}>
                                <Link href="/login" style={{ textDecoration: 'none' }}>Login</Link>
                            </ListItem>
                            <ListItem style={{ padding: '8px 16px' }}>
                                <Link href="/register" style={{ textDecoration: 'none' }}>Register</Link>
                            </ListItem>
                        </List>
                    </Drawer>
                </>
            ) : (
                <>
                    {headerElements.map((headerElement, index) => (
                        <Grid item container xs={12} lg={2} key={index} className='header-element-container'>
                            <Link href={headerElement.href} className='header-element'>
                                <Typography className='header-element-text' variant='h5'>{headerElement.text}</Typography>
                            </Link>
                        </Grid>
                    ))}
                    <Grid item xs={12} lg={1} className='header-element-container' style={{ textAlign: 'right' }}>
                        <Link href="/login" style={{ textDecoration: 'none' }}>Login</Link>
                    </Grid>
                    <Grid item xs={12} lg={1} className='header-element-container' style={{ textAlign: 'right' }}>
                        <Link href="/register" style={{ textDecoration: 'none' }}>Register</Link>
                    </Grid>
                </>
            )}
        </Grid>
    );
};