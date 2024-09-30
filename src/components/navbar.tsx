import { Link, useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button"
import React, {SVGProps, useEffect, useState} from 'react';
import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import squid from '/coneheadsquidsprite.gif';
import tcet from '/tcet.png';
import floppy from '/floppy.png';
import ChatComponent from "@/components/chat/chat.tsx";
import ReadmeComponent from "@/components/readme/readme.tsx";
import LeaderboardComponent from "@/components/leaderboard/leaderboard.tsx";
import {dryrun} from "@permaweb/aoconnect";




export function Navbar() {
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState(""); // State to store the address
  const [userFloppy, setUserFloppy] = useState(0); // State to store the address
  const [nbtickets, setnbtickets] = useState(""); // State to store the address
  const { connected ,connect } = useConnection();
  const [showChat, setShowChat] = useState(false); // State to control chat visibility
  const [showLeaderboard, setShowLeaderboard] = useState(false); // State to control chat visibility
  const [showReadme, setShowReadme] = useState(false); // State to control chat visibility
  const processId = "nGW84ViSugstUlZJ8RIGpAInd5RxOuOle8GOHsT6nIQ";
  const ticketsProcessId = "IpPX7yctFQcbFdikpY7_KGEuETSuD7vs6IjuDMiDbgc";
  let ticketsResult =[];
  // Async function to connect and get the user address

  const fetchUserAddress = async () => {
    try {
      // Connect to the wallet
      await window.arweaveWallet.connect(["ACCESS_ADDRESS"]);

      // Wait for the active wallet address
      const address1 = await window.arweaveWallet.getActiveAddress();

      // Check if the address is valid
      if (address1 && address1 !== "") {
        // Store the valid address in state
        setUserAddress(address1);
        window.userAddress = address1; // Optionally, update the global window object
      } else {
        console.warn("Received an empty address, retrying...");
        setTimeout(fetchUserAddress, 5000); // Retry after 5 seconds
      }

    } catch (error) {
      console.error("Failed to connect or get address:", error);
      setTimeout(fetchUserAddress, 5000); // Retry after 5 seconds
    }
  };
  const getFloppy = async () => {
    try {
      // Await the result of the dry run
      const result = await dryrun({
        process: processId,
        tags: [
          { name: "Action", value: "Balance" },
          { name: "Recipient", value: userAddress }
        ]
      });

      // Ensure the result structure is correct before calculating floppy
      if (result && result.Messages && result.Messages[0] && result.Messages[0].Data) {
        const floppy = Number(result.Messages[0].Data) / 100;
        console.log('Floppy value:', floppy);

        // Set the user floppy using the setUserFloppy function
        setUserFloppy(floppy);

        return floppy;
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error in dryrun or floppy calculation:', error);
    }
  };



  const getTickets = async () => {
    try {
      // Await the result of the dry run
      const result = await dryrun({
        process: ticketsProcessId,
        tags: [
          { name: "Action", value: "Tickets-Info" },
          { name: "Recipient", value: userAddress }
        ]
      });
      ticketsResult= result.Messages.map((message) => {
        console.log(message.Data);

        const tickets = JSON.parse(message.Data);
        console.log(tickets);
        return tickets;
      });
      console.log('ticketsResult[0] :');
      console.log(ticketsResult[0])
      if(ticketsResult[0] && ticketsResult[0]['nbOfTickets']) {
        setnbtickets( ticketsResult[0]['nbOfTickets']);
        console.log('nbtickets :');
        console.log(nbtickets)
      }


    } catch (error) {
      console.error('Error in dryrun or ticketsInfo data:', error);
    }
  };

  // Effect to fetch user address when the component mounts
  useEffect(() => {
    fetchUserAddress(); // Call the async function to fetch user address
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect to call getFloppy when userAddress is valid
  useEffect(() => {
    if (userAddress && userAddress !== "no value") {
      getFloppy(); // Call getFloppy with the valid address
    }
  }, [userAddress]); // Runs every time userAddress changes  // Effect to call getFloppy when userAddress is valid

  useEffect(() => {
    if (userAddress && userAddress !== "no value") {
      getTickets(); // Call getFloppy with the valid address
    }
  }, [userAddress]); // Runs every time userAddress changes

  useEffect(() => {



  }, []);

 // Dependency array ensures this effect runs only once on mount

  
  return (
      <div>
    <header className="bg-gray-950 bg-opacity-50 text-white py-2 px-6 md:px-8 lg:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-10">
    <Link  style={{color: "white"}} className="flex items-center gap-2 text-lg font-semibold" to="#">
      <img src={squid} className="h-10 w-10" />
      <span> Coneheadsquid </span>
      <span className={"crop-text"}>  &gt; {userAddress} </span>
      {/* Pass the callback to the child to receive the variable */}



    </Link>
    <Link className="flex items-center gap-2 text-lg font-semibold" to="#">
      <img src={tcet} className="h-13 w-12" />
      <span style={{color: "white"}}>{userAddress==''?'?':'X '+ nbtickets} </span>
      <span style={{color: "white"}}> {userAddress==''?'':'(reset in 24h) '} </span>
    </Link>
      <Link className="flex items-center gap-2 text-lg font-semibold" to="#">
        <img src={floppy} className="h-10 w-10" />
        <span style={{color: "white"}}> {userAddress==''?'?':'X ' +userFloppy} </span>
      </Link>
    <nav className="hidden md:flex items-center gap-20">


      <button onClick={() => setShowLeaderboard(!showLeaderboard)}>
        {showLeaderboard ? "Hide Leaderboard" : "Open Leaderboard"}
      </button>
      <button onClick={() => setShowReadme(!showReadme)}>
        {showReadme ? "Hide Readme" : "Open Readme"}
      </button>
      <button onClick={() => setShowChat(!showChat)}>
        {showChat ? "Hide Chat" : "Open Chat"}
      </button>



      <ConnectButton
      accent="rgb(32, 32, 32)"
        profileModal={true}
        showBalance={false}
        showProfilePicture={true}
      />
    </nav>
    <Button className="md:hidden" size="icon" variant="ghost">
      <MenuIcon className="h-6 w-6" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  </header>
      <main >
      {/* Conditionally render the chat component */}
      <div style={{top:79}} className="fixed top-159 left-230 right-20 z-10">
        {showChat && <ChatComponent />}</div>

      <div style={{top:79, right:330 }} className="fixed z-10">
        {showReadme && <ReadmeComponent />} </div>

      <div style={{top:79, right:650 }} className="fixed z-10 ">
      {showLeaderboard && <LeaderboardComponent />}</div>

      </main>
      </div>
  )
}



function MenuIcon(props: SVGProps<SVGSVGElement>) {

  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}



