import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import HomePage from './pages/HomePage';
import AddAuctionPage from './pages/AddAuctionPage';
import AuctionsPage from './pages/AuctionsPage';
import BidsPage from './pages/BidsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AuctionRoomPage from './AuctionRoom/AuctionRoomPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { pagesLoggedIn, pagesLoggedOut } from './resources/constants';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // can set to false to view login/signup
  
  // @ David, if you can figure out...
  // Need to update with authentication, where users that are not logged in can only view the login or signup page

  // feel free to change that for login/ signup if need to
  // might remove my auctions and my bids page - ignore those for now (not in mvp)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="wrapper">
        <BrowserRouter>
          <Header pages={isAuthenticated ? pagesLoggedIn : pagesLoggedOut}/>
          <Switch>
            <Route exact path="/all" component={HomePage} />
            <Route exact path="/new" component={AddAuctionPage} />
            <Route exact path="/myauctions" component={AuctionsPage} />
            <Route exact path="/mybids" component={BidsPage} />
            <Route exact path="/signup" component={SignUpPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/auction" component={AuctionRoomPage} />
            <Route component={NotFoundPage} />
          </Switch>
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
