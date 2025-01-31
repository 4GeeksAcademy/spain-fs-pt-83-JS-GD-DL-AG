import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Context } from "./store/appContext";

import { Home } from "./pages/home";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Dashboard } from './pages/dashboard';
import { LoginSignUp } from "./pages/login-signup";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    const { store } = useContext(Context);
    const isLoggedIn = !!store.token;

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <BrowserRouter>
            <ScrollToTop>
                <ConditionalNavbar isLoggedIn={isLoggedIn} />
                <Routes>
                    <Route element={<Home />} path="/" />
                    <Route path="/login" element={<LoginSignUp />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                    <Route path="*" element={<Dashboard />} />
                </Routes>
                <Footer />
            </ScrollToTop>
        </BrowserRouter>
    );
};

const ConditionalNavbar = ({ isLoggedIn }) => {
    const location = useLocation();

    return (
        <>
            {!isLoggedIn && location.pathname !== "/dashboard" && <Navbar />}
        </>
    );
};

export default injectContext(Layout);
