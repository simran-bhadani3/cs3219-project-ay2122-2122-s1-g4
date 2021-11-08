import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import HomePage from './pages/HomePage';
import AddAuctionPage from './pages/AddAuctionPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuctionRoomPage from './AuctionRoom/AuctionRoomPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { pagesLoggedIn, pagesLoggedOut } from './resources/constants';
import { AuthContext } from './AuthContext';


function App() {
  const auth = useContext(AuthContext);
  const [token, setToken] = useState(null);
  const login = (token) => {
    setToken(token);
    // console.log(token);
    // console.log(auth.isLoggedIn);
    // console.log(!!token);
  }
  const logout = () => {
    setToken(null);
  }
  useEffect(() => {
    const storedData = localStorage.getItem('user');
    // console.log('user: ', storedData);
    login(storedData);
    // console.log(storedData);
  }, [login]);

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, login: login, logout: logout }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="wrapper">
          <BrowserRouter>
            <Header pages={!!token ? pagesLoggedIn : pagesLoggedOut} />
            {/* redirects user to login or signup page only */}
            {!!token ? (
              <Switch>
                <Route exact path="/all" component={HomePage} />
                <Route exact path="/new" component={AddAuctionPage} />
                <Route exact path="/profile" component={ProfilePage} />
                <Route exact path="/" component={HomePage} />
                <Route exact path="/auction/:id" component={AuctionRoomPage} />
                <Route exact path="/login" component={HomePage} />
                <Route component={NotFoundPage} />
              </Switch>
            ) : (
              <Switch>
                <Route exact path="/signup" component={SignUpPage} /> {/* SignUpPage */}
                <Route exact path="/*" component={LoginPage} /> {/* LoginPage */}
              </Switch>
            )}

            <Footer />
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
