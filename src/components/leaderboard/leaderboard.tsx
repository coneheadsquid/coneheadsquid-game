// ChatComponent.tsx


import {dryrun} from "@permaweb/aoconnect";
import {useConnection} from "@arweave-wallet-kit/react";
import React, {useEffect, useState} from "react";
import {ChatMessageHistory} from "@/components/chat/model.ts";

const LeaderboardComponent: React.FC = () => {
    const processId = "nGW84ViSugstUlZJ8RIGpAInd5RxOuOle8GOHsT6nIQ";
    let filteredResult =[{}];
    const [messages, setMessages] = useState<ChatMessageHistory>([]);
    const [isFetching, setIsFetching] = useState(false);
    const { connected ,connect } = useConnection();
    const fetchPosts = async () => {
        if (!connected) {
            // return;
        }
        try {
            const addr = await window.arweaveWallet.getActiveAddress();
            const result = await dryrun({
                process: processId,

                tags: [{ name: "Action", value: "Balances" }]
            });
            console.log("Get-Last-Messages result", result);
            filteredResult = result.Messages.map((message) => {
                const parsedData = JSON.parse(message.Data);

                const sortedMessages = Object.entries(parsedData).sort(([, amountA], [, amountB]) => Number(amountB) - Number(amountA));
                setMessages(sortedMessages);
                console.log('sortedMessages :');
                console.log(sortedMessages);
                return parsedData;
            });
            console.log('filteredResult :');
            console.log(filteredResult);
            // setPostList(filteredResult);

            console.log('messages :');
            console.log(messages)
        } catch (error) {
            console.log(error);
        }
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
        <div  className="window " style={{ color:"black", maxWidth: "700px", background: "black", opacity: 0.92, top:"150px" ,right:"300px",fontSize:"1.3em" }}>
            <div className="title-bar">
                <div className="title-bar-text">Leaderboard.csv</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" />
                </div>
            </div>
                <div className="sunken-panel" style={{height: "160px", width: "270px"}}>
                    <table className="interactive">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Address</th>
                            <th>Name</th>
                            <th>FLOPPY</th>
                        </tr>
                        </thead>
                        <tbody>
                        {messages && messages.length > 0 ? (messages.map(([address, amount],j) => (
                            <tr key={address}>
                                <td>{j+1}</td>
                                <td className="crop-text">{address}</td>
                                <td>Test User</td>
                                <td>{(Number(amount) / 100).toFixed(2)}</td>
                            </tr>
                        ))
                        ):(
                            <p> Loading ..</p>
                        )}
                        </tbody>
                    </table>
                </div>


        </div>
    );
};

export default LeaderboardComponent;
