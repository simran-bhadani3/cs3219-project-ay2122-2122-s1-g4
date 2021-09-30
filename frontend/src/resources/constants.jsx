import React from 'react';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

export const introduction = 'I’m Michelle, a Web Designer and Developer based in Singapore. Currently a final year student pursuing the Bachelor of Computing in Computer Science at NUS and was previously part of the NUS Overseas College Program. I have experience interning with Love, Bonito as a Product Intern and GoalsMapper as a Full Stack Developer.';

export const pagesLoggedIn = [
    { href: "/all", label: "View All" },
    { href: "/mybids", label: "My Bids" },
    { href: "/myauctions", label: "My Auctions" },
    { href: "/new", label: "Create New Auction", isButton: true },
    { href: "/", icon: <LogoutRoundedIcon /> }
];

export const pagesLoggedOut = [
    { href: "/login", label: "Login", isButton: true },
    { href: "/signup", label: "Sign Up", isButton: true }
];