"use client"

import { ShieldCheck, User, LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { useAuth } from "@/lib/auth"

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated, logout, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter text-white">AI Fake News Analyzer</h1>
          </div>
        </Link>

        <nav className="flex items-center gap-2 md:gap-6">
          <NavLink href="/" active={pathname === "/"}>Home</NavLink>

          {!isLoading && (
            isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold px-4">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-slate-400 hover:text-white hover:bg-black font-bold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/login" active={pathname === "/login"}>Login</NavLink>
                <NavLink href="/register" active={pathname === "/register"}>Register</NavLink>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  )
}

function NavLink({ href, children, active }: { href: string, children: React.ReactNode, active: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-bold transition-all hover:text-white ${active ? "text-white" : "text-slate-500"
        }`}
    >
      {children}
    </Link>
  )
}
