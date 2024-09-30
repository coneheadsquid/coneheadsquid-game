
import {  Link , Navigate , useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import  { SVGProps } from "react"

export function Footer() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">

      </main>
      <footer className=" text-white py-2 px-4 md:px-8 lg:px-7 flex items-center justify-between fixed bottom-0 left-0 right-0 z-10">
        <p className="text-sm">Coneheadsquid 2024</p>
        <nav className="flex items-center gap-4 text-sm">
            <a href="https://github.com/coneheadsquid/coneheadsquid-game" target="_blank" rel="noopener noreferrer">
                <img src="github-mark-white.svg" alt="GitHub" width="16" height="16" />
            </a>
            <a href="https://bazar.arweave.dev/#/profile/nSEjIR1B2_NvDxc9bHFKf7BZ4Y8SMlzeVqplkVbs1ug/assets/" target="_blank" rel="noopener noreferrer">
                <img src="bazar.svg" alt="Bazar" width="20" height="20"  />
            </a>
            <a href="https://x.com/coneheadsquid" target="_blank" rel="noopener noreferrer">
                <img src="x-logo.svg" alt="X" width="13" height="13" />
            </a>



          <p className="text-sm"> v 1.0.2.beta1</p>
        </nav>
      </footer>
    </div>
  )
}


