import React, { useState } from 'react';
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
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 1200px)');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
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
    ];

    return (
        <Grid container alignItems="center" id='header-container'>
            <Grid item xs={6} lg={2} className="logo-container">
                <Link href='/'>
                    <img src={Logo} alt='logo' className='logo' />
                </Link>
            </Grid>

            <Grid item xs={6} lg={8} className="menu-container">
                {!isMobile ? (
                    <>
                        {headerElements.map((headerElement, index) => (
                            <Link href={headerElement.href} className='header-element' key={index}>
                                <Typography className='header-element-text' fontSize={20}>{headerElement.text}</Typography>
                            </Link>
                        ))}
                    </>
                ) : null}
            </Grid>

            <Grid item xs={6} lg={2} className="profile-container">
                {!isMobile ? (
                    <>
                        {user ? (
                            <>
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
                            </>
                        ) : (
                            <div className="auth-links">
                                <Link href="/login" className='header-element'>Login</Link>
                                <Link href="/register" className='header-element'>Register</Link>
                            </div>
                        )}
                    </>
                ) : (
                    <IconButton onClick={toggleDrawer(true)} size="large" className='menu-icon'>
                        <MenuIcon style={{ fontSize: '2rem' }} />
                    </IconButton>
                )}
            </Grid>

            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} style={{ width: 250 }}>
                    {headerElements.map((headerElement, index) => (
                        <ListItem key={index} style={{ padding: '10px 10px' }}>
                            <Link href={headerElement.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography fontSize={15}>{headerElement.text}</Typography>
                            </Link>
                        </ListItem>
                    ))}
                    {user ? (
                        <>
                            <ListItem style={{ padding: '12px 16px', marginLeft: '20px' }}>
                                <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
                            </ListItem>
                            <ListItem style={{ padding: '12px 16px', marginLeft: '20px' }} onClick={handleLogout}>
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
        </Grid>
    );
};
