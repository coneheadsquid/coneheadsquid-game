
import {  Link , Navigate , useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import  { SVGProps } from "react"

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-950 text-white py-4 px-6 md:px-8 lg:px-12 flex items-center justify-between">
        <Link className="flex items-center gap-2 text-lg font-semibold" to="#">
          <FeatherIcon className="h-6 w-6" />
          <span>Vercel Blog</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link className="hover:underline underline-offset-4" to="#">
            Blog
          </Link>
          <Link className="hover:underline underline-offset-4" to="#">
            Write
          </Link>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </nav>
        <Button className="md:hidden" size="icon" variant="ghost">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </header>
      <main className="flex-1">

      </main>
      <footer className="bg-gray-950 text-white py-6 px-4 md:px-8 lg:px-12 flex items-center justify-between">
        <p className="text-sm">© 2024 Coneheadsquid. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link className="hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="hover:underline underline-offset-4" to="#">
            Privacy Policy
          </Link>
          <Link className="hover:underline underline-offset-4" to="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}
function FeatherIcon(props:SVGProps<SVGSVGElement>) {
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
      <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
      <path d="M16 8 2 22" />
      <path d="M17.5 15H9" />
    </svg>
  )
}


function MenuIcon(props:SVGProps<SVGSVGElement>) {
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


function PlusIcon(props:SVGProps<SVGSVGElement>) {
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
