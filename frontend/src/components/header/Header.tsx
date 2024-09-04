import React, { useEffect, useState } from 'react';
import {
    Drawer,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    Typography,
    Menu,
    MenuItem,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Header.scss';
import Logo from '../../shared/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../services/api";

export const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width:1200px)');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isAuth, setIsAuth] = useState(false);
    // const { user } = useAuth() as { user: any };
    const navigate = useNavigate();

    // useEffect(() => {
    //     setIsAuth(!!user);
    // }, [user]);
        useEffect(() => {
        setIsAuth(true);
    });

    const handleLogout = async () => {
        try {
            await logout();
            setIsAuth(false);
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Tab') {
            return;
        }
        setDrawerOpen(open);
    };

    const headerElements = [
        { text: '🏞️ Browse Trails', href: '/browse-trails' },
        { text: '🛤️ Trail Planner', href: '/trail-planner' },
        // { text: '⭐ Features', href: '/features' }
    ];

    return (
        <Grid container alignItems="center" id='header-container'>
            <Grid item xs={6} lg={2}>
                <Link href='/'>
                    <img src={Logo} alt='logo' className='logo' />
                </Link>
            </Grid>
            {isMobile ? (
                <>
                    <Grid item xs={6} style={{ textAlign: 'right', paddingLeft: '100px' }}>
                        <IconButton onClick={toggleDrawer(true)} size="large">
                            <MenuIcon style={{ fontSize: '2rem' }} />
                        </IconButton>
                    </Grid>
                    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                        <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} style={{ width: 250 }}>
                            {headerElements.map((headerElement, index) => (
                                <ListItem key={index} style={{ padding: '35px 16px' }}>
                                    <Link href={headerElement.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography variant='h6'>{headerElement.text}</Typography>
                                    </Link>
                                </ListItem>
                            ))}
                            {isAuth ? (
                                <>
                                    <ListItem style={{ padding: '12px 16px',  }}>
                                        <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
                                    </ListItem>
                                    <ListItem style={{ padding: '12px 16px' }} onClick={handleLogout}>
                                        <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Logout</Link>
                                    </ListItem>
                                </>
                            ) : (
                                <>
                                    <ListItem style={{ padding: '12px 16px' }}>
                                        <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
                                    </ListItem>
                                    <ListItem style={{ padding: '12px 16px' }}>
                                        <Link href="/register" style={{ textDecoration: 'none', color: 'inherit' }}>Register</Link>
                                    </ListItem>
                                </>
                            )}
                        </List>
                    </Drawer>
                </>
            ) : (
                <>
                    {headerElements.map((headerElement, index) => (
                        <Grid item xs={12} lg={2} key={index} className='header-element-container'>
                            <Link href={headerElement.href} className='header-element'>
                                <Typography className='header-element-text' variant='h5'>{headerElement.text}</Typography>
                            </Link>
                        </Grid>
                    ))}
                    {isAuth ? (
                        <Grid item xs={12} lg={1} className='header-element-container' style={{ textAlign: 'right' }}>
                            <IconButton onClick={handleMenuClick} size="large" className='header-icon'>
                                <AccountCircleIcon style={{ fontSize: '3rem' }} />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                <MenuItem onClick={handleMenuClose}>
                                    <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
                                </MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Grid>
                    ) : (
                        <>
                            <Grid item xs={12} lg={1} className='header-element-container' style={{ textAlign: 'right' }}>
                                <Link href="/login" style={{ textDecoration: 'none' }}>Login</Link>
                            </Grid>
                            <Grid item xs={12} lg={1} className='header-element-container' style={{ textAlign: 'right' }}>
                                <Link href="/register" style={{ textDecoration: 'none' }}>Register</Link>
                            </Grid>
                        </>
                    )}
                </>
            )}
        </Grid>
    );
};
