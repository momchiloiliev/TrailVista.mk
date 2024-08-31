import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {MainLayout} from "./components/main-layout/MainLayout";
import {Home} from "./pages/home-page/Home";
// import Login from "./pages/Login";
// import RegisterPage from "./pages/RegisterPage";
// import {SearchRoute} from "./pages/search-route-page/SearchRoute";
// import ProfilePage from './pages/ProfilePage';
// import ProfileEditPage from './pages/ProfileEditPage';
// import {RoutePage} from "./pages/route-page/RoutePage";
// import TransportCard from "./pages/transport-card-page/TransportCard";

const App: React.FC = () => {
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<Home/>}/>
                        {/* <Route path="routes" element={<Routes/>}/> */}
                        {/* <Route path="route-planner" element={<RoutePlanner/>}/>
                        {/* <Route path="features" element={<Features/>}/>

                        <Route path="route/:id" element={<RoutePage/>}/> */}
                        {/*
                            Note: All other routes need to be children of MainLayout route so the header and footer render accordingly

                            example:
                            <Route path="list" element={<ListPage />} />
                            */}
                            {/* <Route path="/login" element={<LoginPage />}> </Route>
                            <Route path="/register" element={<RegisterPage />}> </Route>
                            <Route path="/profile" element={<ProfilePage />}> </Route>
                            <Route path="/profile-edit" element={<ProfileEditPage />}> </Route> */}

                        </Route>
                        
                </Routes>
            </Router>
    );
};

export default App;
