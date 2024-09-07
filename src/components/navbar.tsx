import Link from "next/link"
import { Home, PlusCircle } from "lucide-react"

function GroovyStacksLogo() {
  return (
    <svg width="45" height="45" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
      <g className="animate-float">
        <circle cx="60" cy="60" r="45" stroke="currentColor" strokeWidth="6"/>
        <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="4"/>
        <circle cx="60" cy="60" r="15" stroke="currentColor" strokeWidth="2"/>
        <circle cx="60" cy="60" r="5" fill="currentColor"/>
      </g>
      <g className="origin-[30px_30px] animate-needle-move">
        <rect x="25" y="25" width="10" height="40" rx="2" fill="currentColor" />
        <rect x="23" y="23" width="14" height="14" rx="7" fill="currentColor" />
      </g>
    </svg>
  )
}

export function Navbar() {
  return (
    <nav className="bg-primary-foreground text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center space-x-3 h-[60px] group">
          <GroovyStacksLogo />
          <span className="font-bold text-2xl tracking-tight group-hover:text-gray-200 transition-colors font-retro">
            GroovyStacks
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:text-gray-200 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-lg">Home</span>
          </Link>
          <Link
            href="/add"
            className="flex items-center space-x-2 bg-white text-primary-foreground px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-lg font-medium">Add record</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}