import { Link, useNavigate} from "react-router-dom";
import { Button } from "@/components/ui/button"
import React, { SVGProps } from 'react';
import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import squid from '/coneheadsquidsprite.gif';
import UserAddress from "@/components/userAddress.tsx";




export function Navbar() {
  const navigate = useNavigate();

  const { connected ,connect } = useConnection();


  
  return (
    <header className="bg-gray-950 text-white py-4 px-6 md:px-8 lg:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-10">
    <Link className="flex items-center gap-2 text-lg font-semibold" to="#">
      <img src={squid} className="h-6 w-6" />
      <span> Coneheadsquid Game </span>
      <UserAddress/>

    </Link>
    
    <nav className="hidden md:flex items-center gap-6">
    <Link className="hover:underline underline-offset-4" to="/">
        Rules

      </Link>
      <Link className="hover:underline underline-offset-4" to="/view">
        Chat
    
      </Link>
      <Link className="hover:underline underline-offset-4" to="/writeblog">
        Leaderboard
      </Link>
      <ConnectButton
      accent="rgb(32, 32, 32)"
        profileModal={true}
        showBalance={true}
        showProfilePicture={true}
      />
    </nav>
    <Button className="md:hidden" size="icon" variant="ghost">
      <MenuIcon className="h-6 w-6" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  </header>
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


function PlusIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
