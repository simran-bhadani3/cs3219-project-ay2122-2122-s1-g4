import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_BID_EVENT = "newBid";
const END_AUCTION_EVENT = "endAuction";
// const SOCKET_SERVER_URL = `https://${process.env.REACT_APP_dockerauctionmanagerserver || 'localhost:9000'}`;
//kubernetes nodeport
// const SOCKET_SERVER_URL = `https://${process.env.REACT_APP_dockerauctionmanagerserver || 'localhost:30199'}`;
//chat ingress
// https://
// const SOCKET_SERVER_URL = `${process.env.REACT_APP_dockerauctionmanagerserver || 'http://34.126.147.222/auctionroom/'}`;
// apigateway only
const SOCKET_SERVER_URL = `${process.env.REACT_APP_dockerauctionmanagerserver || 'http://localhost/auctionroom'}`;
// const SOCKET_SERVER_URL = `${process.env.REACT_APP_dockerauctionmanagerserver || 'http://34.124.176.116/auctionroom/'}`;
// const SOCKET_SERVER_URL = `${process.env.REACT_APP_dockerauctionmanagerserver || 'http://34.124.164.87/auctionroom/'}`;
const useChat = (roomId) => {
    const [messages, setMessages] = useState([]);
    const [bids, setBids] = useState([]);
    const [highestBid, setHighestBid] = useState({});
    const [status, setStatus] = useState(true);
    const socketRef = useRef();

    useEffect(() => {
        console.log(SOCKET_SERVER_URL)
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            extraHeaders: {
                Authorization: JSON.parse(localStorage.getItem('user'))
            },
            transport: ['websocket'],
            // protocols: ["http"],
            query: { roomid: roomId, token: JSON.parse(localStorage.getItem('user')) }

        });

        //new message
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
            message['timestamp'] = new Date().toLocaleTimeString();
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id,
            };
            setMessages((messages) => [...messages, incomingMessage]);
        });

        socketRef.current.on(NEW_BID_EVENT, (bid) => {
            console.log(bid);
            setHighestBid({ highest: bid.bid, username: bid.username });
        });

        //room ended by auction owner
        socketRef.current.on(END_AUCTION_EVENT, (bid) => {
            setStatus(false);
            socketRef.current.disconnect();
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    //send message
    const sendMessage = (messageBody) => {
        console.log(roomId);
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            body: messageBody,

            senderId: socketRef.current.id,
            timestamp: Date(),
            username: localStorage.getItem('username')
        });
    };

    //send bid
    const sendBid = (bidamount) => {
        socketRef.current.emit(NEW_BID_EVENT, {
            bid: bidamount,
            username: localStorage.getItem('username'),
            roomname: roomId,
            senderId: socketRef.current.id,
            timestamp: Date()
        });
    };

    //auction owner ends auction, contains authtoken for authorization
    const endAuction = (bidBody) => {
        socketRef.current.emit(END_AUCTION_EVENT, {
            body: bidBody,
            authtoken: localStorage.getItem('user'),
            senderId: socketRef.current.id,
            timestamp: Date()
        });
    };


    return { messages, sendMessage, bids, sendBid, status, endAuction, highestBid, setHighestBid };
};

export default useChat;