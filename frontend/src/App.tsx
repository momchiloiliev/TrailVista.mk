import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MainLayout} from "./components/main-layout/MainLayout";
import {Home} from "./pages/home-page/Home";
import BrowseTrails from './pages/browse-trails/BrowseTrails';
import TrailPlanner from './pages/trail-planner/TrailPlanner';
import Register from './pages/register-page/Register';
import Login from './pages/login-page/Login';
import Profile from './pages/profile-page/Profile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// import {RoutePage} from "./pages/route-page/RoutePage";
// import TransportCard from "./pages/transport-card-page/TransportCard";

const App: React.FC = () => {
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<Home/>}/>
                        <Route path="browse-trails" element={<BrowseTrails/>}/>
                        {/* <Route path="trail-planner" element={<TrailPlanner/>}/> */}
                        <Route path="profile" element={<Profile/>}/>
                        <Route path="trail-planner" element={<ProtectedRoute><TrailPlanner /></ProtectedRoute>} />
                        {/* <Route path="features" element={<Features/>}/>

                        <Route path="route/:id" element={<RoutePage/>}/> */}
                        {/*
                            Note: All other routes need to be children of MainLayout route so the header and footer render accordingly

                            example:
                            <Route path="list" element={<ListPage />} />
                            */}
                            <Route path="/login" element={<Login />}> </Route>
                            <Route path="/register" element={<Register />}> </Route>
                            {/* <Route path="/profile" element={<ProfilePage />}> </Route>
                            <Route path="/profile-edit" element={<ProfileEditPage />}> </Route> */}

                        </Route>
                        
                </Routes>
            </Router>
    );
};

export default App;
