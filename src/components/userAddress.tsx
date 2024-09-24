import React, { useState, useEffect } from "react";
import {useConnection} from "@arweave-wallet-kit/react";

const UserAddress = () => {
  const [userAddress, setUserAddress] = useState(""); // State to store the address
  const { connected  } = useConnection();

  useEffect(() => {
    setUserAddress("no value");
    // Function to connect wallet and get the address
    const getUserAddress = async () => {
      try {
        await window.arweaveWallet.connect(["ACCESS_ADDRESS"]); // Connect to the wallet
        const address = await window.arweaveWallet.getActiveAddress(); // Get the active address
        setUserAddress(address); // Store the address in state
        // Optionally, keep window.userAddress up to date if userAddress changes
        window.userAddress = address;
      } catch (error) {
        console.error("Failed to connect or get address:", error);
      }
    };



    // Expose the function globally so Godot can call it
    //window.getUserAddress2 = getUserAddress;
      getUserAddress(); // Call the function when the component mounts





  }, []);

  return (
    <div>
      <span>User Address: {userAddress ? userAddress : "Connecting..."}</span>
    </div>
  );
};

export default UserAddress;
