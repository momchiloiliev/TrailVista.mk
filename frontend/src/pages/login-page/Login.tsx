import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './login.scss';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import './login.scss';
import { loginUser } from '../../services/api';


const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    // const { login, user, logout, loading } = useAuth() as { login: Function, user: any, logout: Function, loading: boolean };

    const navigate = useNavigate();
    const location = useLocation();

    // useEffect(() => {
    //     if (user) {
    //         setIsAuth(true);
    //         navigate('/');
    //     }
    //     else {
    //         setIsAuth(false);
    //     }
    // }, [user]);


    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        try {
            await loginUser(email, password, rememberMe);
        } catch (error: any) {
            console.error('Login error:', error.message);
            setError(error.message);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/auth/google';

    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:8000/auth/facebook';
    };

    return (
        <div className="login-container">
            <h2>Login in</h2>
            <p>Welcome back</p>
            <div className="social-login">
                <button className="google-login" onClick={handleGoogleLogin}>
                    <GoogleIcon style={{ marginRight: '8px', color: 'red' }} />
                    Google
                </button>
                <button className="facebook-login" onClick={handleFacebookLogin}>
                    <FacebookIcon style={{ marginRight: '8px', color: 'blue' }} />
                    Facebook
                </button>
            </div>
            <div className="divider">Email</div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div className="options">
                    <label>
                        <input type="checkbox" />
                        Remember me
                    </label>
                    <a href="#">Forget Password</a>
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            {error && <p className="error">{error}</p>}

            <p className="create-account">
                No account? <a href="/register">Create Account</a>
            </p>
        </div>
    );
};

export default Login;
