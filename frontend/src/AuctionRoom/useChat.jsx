import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_BID_EVENT = "newBid";
const SOCKET_SERVER_URL = `http://${process.env.REACT_APP_dockerauctionmanagerserver||'localhost:9000'}`;

const useChat = (roomId) => {
    const [messages, setMessages] = useState([]);
    const [bids, setBids] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            query: { roomId },
        });
        
        //new message
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id,
            };
            setMessages((messages) => [...messages, incomingMessage]);
        });

        //new bid
        socketRef.current.on(NEW_BID_EVENT, (bid) => {
            console.log(bid);
            const incomingBid = {
                ...bid,
                ownedByCurrentUser: bid.senderId === socketRef.current.id,
            };
            setBids((bids) => [...bids, incomingBid]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    //send message
    const sendMessage = (messageBody) => {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            body: messageBody,
            senderId: socketRef.current.id,
            timestamp: Date()
        });
    };

     //send bid
     const sendBid = (bidBody) => {
        socketRef.current.emit(NEW_BID_EVENT, {
            body: bidBody,
            senderId: socketRef.current.id,
            timestamp: Date()
        });
    };

    return { messages, sendMessage, bids, sendBid };
};

export default useChat;