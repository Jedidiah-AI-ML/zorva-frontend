// "use client"

// import Link from "next/link"
// import { useTheme } from "next-themes"
// import { Button } from "@/components/ui/button"
// import { Moon, Sun, User, Settings, LogOut } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// export function DashboardHeader() {
//   const { theme, setTheme } = useTheme()

//   return (
//     <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           <div className="flex items-center gap-6">
//             <Link href="/" className="flex items-center gap-2">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
//                 <span className="text-lg font-bold text-primary-foreground">Z</span>
//               </div>
//               <span className="text-xl font-bold tracking-tight">Zorva</span>
//             </Link>
//             <nav className="hidden md:flex items-center gap-6">
//               <Link 
//                 href="/dashboard" 
//                 className="text-sm font-medium text-foreground"
//               >
//                 Courses
//               </Link>
//               <Link 
//                 href="/billing" 
//                 className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 Billing
//               </Link>
//             </nav>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className="rounded-full"
//             >
//               <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//               <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//               <span className="sr-only">Toggle theme</span>
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//                   <Avatar className="h-9 w-9">
//                     <AvatarFallback className="bg-primary text-primary-foreground">
//                       JD
//                     </AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <div className="flex items-center justify-start gap-2 p-2">
//                   <div className="flex flex-col space-y-1 leading-none">
//                     <p className="font-medium">John Doe</p>
//                     <p className="text-sm text-muted-foreground">john@example.com</p>
//                   </div>
//                 </div>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link href="/dashboard" className="cursor-pointer">
//                     <User className="mr-2 h-4 w-4" />
//                     Dashboard
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/billing" className="cursor-pointer">
//                     <Settings className="mr-2 h-4 w-4" />
//                     Billing
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign Out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }



"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { GraduationCap, LayoutDashboard, CreditCard, LogOut } from "lucide-react"

export function DashboardHeader() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U"

  const displayName = user?.fullName
    || user?.emailAddresses?.[0]?.emailAddress
    || "User"

  const email = user?.emailAddresses?.[0]?.emailAddress ?? ""

  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">Zorva</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/billing" className="text-sm font-medium hover:text-primary transition-colors">
              Billing
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.imageUrl} alt={displayName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="font-medium text-sm">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}