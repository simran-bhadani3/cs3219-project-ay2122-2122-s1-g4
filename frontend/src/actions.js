export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user').toString());
}


export function getAuthConfig() {
    const jwt = localStorage.getItem('user').toString();
    const userConfig = {
        headers: {
           "Authorization": jwt.substr(1, jwt.length - 2)
        }
    };
    return userConfig;
}

// external auctiondetails url
export function getAuctionDetailsUrl() {
    const auctiondetailurl = `${process.env.REACT_APP_dockerauctiondetailsserver || 'http://localhost/api/auctiondetails/'}`;
    return auctiondetailurl;
}

// external currency url
export function getCurrencyUrl() {
    const currencyurl = `${process.env.REACT_APP_dockercurrencymanagementserver || 'http://localhost/api/currency/'}`;
    return currencyurl;
}

//this is also the auctionroom url
// external bid url
export function getBidUrl() {
    const bidurl = `${process.env.REACT_APP_dockerauctionroomserver || 'http://localhost/api/room/'}`;
    return bidurl;
}
