// ChatComponent.tsx
import React, { useEffect, useState } from "react";
import { createChatClientForProcess } from "./chatClient"; // Adjust the path if needed
import { ChatMessageCreate, ChatMessageHistory } from "./model"; // Adjust the path if needed
import {connect, createDataItemSigner, dryrun, message} from "@permaweb/aoconnect";
import {useConnection} from "@arweave-wallet-kit/react";
import {formatTimestamp} from "@/utils/formatting.ts";
const ChatComponent: React.FC = () => {
    const [userAddress, setUserAddress] = useState(""); // State to store the address

    const [messages, setMessages] = useState<ChatMessageHistory>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const { connected ,connect } = useConnection();
    let filteredResult =[{}];

    // Create chat client for interacting with the chat backend
    const chatClient = createChatClientForProcess(/* wallet */ "someWalletId")(
        "processId"
    );
    const processId = "t6T5n-P4Na30i8g08M2dGOGFM2b7iqApkQJXgvl_fwk";

    const [isFetching, setIsFetching] = useState(false);
    const [postList, setPostList] = useState();
    const fetchPosts = async () => {
        if (!connected) {
           // return;
        }
        try {
            const address1 = await window.arweaveWallet.getActiveAddress();
            setUserAddress(address1);
            const result = await dryrun({
                process: processId,

                tags: [{ name: "Action", value: "Get-Last-Messages" }]
            });
            console.log("Get-Last-Messages result", result);
            filteredResult = result.Messages.map((message) => {
                const parsedData = JSON.parse(message.Data);
                return parsedData;
            });
            console.log('filteredResult :');
            console.log(filteredResult);
           // setPostList(filteredResult);
            setMessages(filteredResult);
            console.log('messages :');
            console.log(messages)
        } catch (error) {
            console.log(error);
        }
    };

    // Function to load chat history


    // Function to post a new message
    const handleSendMessage = async () => {


        const result = await message({
            process: processId,
            data: newMessage,
            signer: createDataItemSigner(window.arweaveWallet),
            tags: [{ name: "Action", value: "Send-Message" },{ name: "Name", value: "squid" }]
        });
        console.log("Send-Message", result);
       // await chatClient.postMessage(message);
        setNewMessage("");
        fetchPosts();
        //loadChatHistory(); // Refresh chat history
    };

    // Load chat history on component mount
    useEffect(() => {
        setIsFetching(true);
        console.log('fetchPosts');
        fetchPosts();
        setIsFetching(false);
       // loadChatHistory();
    }, []);

    return (
        <div  className="window" style={{ color:"black", maxWidth: "700px", background: "black", opacity: 0.9, top:"150px" }}>
            <div className="title-bar">
                <div className="title-bar-text">Chat.exe</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" />
                </div>
            </div>
            <div className="window-body chat-box" >
                {/* Check if messages is defined and has any length */}
                {messages && messages.length > 0 ? (
                    messages[0].map((msg) => (
                    <div key={msg.id} style={{  }}>
                        <div key={msg.id} className={`message ${msg.userid === userAddress ? 'sent' : 'received'}`}>
                            <small className="crop-text" style={{ display: 'inline' }}>{msg.userid === userAddress ? 'you' : msg.userid}</small>
                            <div className="message-bubble">
                                <p>{msg.message}</p>

                            </div>
                            <small className="timestamp" style={{ display: 'inline' }}>{formatTimestamp(msg.timestamp / 1000, true)} </small>
                        </div>


                    </div>
                ))
                ):(
                <p>Loading ..</p>
                )}
            </div>
            <div style={{ margin: "10px", marginTop: "0px" }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ marginRight: "10px",width:"210px" }}
                />
                <button  style={{ marginTop: "10px", background:"blue",color:"white" }} onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatComponent;
