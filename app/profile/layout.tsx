"use client"

import { SidebarProfile } from "@/app/profile/components/SidebarProfile"
import Header from "@/components/shared/Header"
import { Separator } from "@/components/ui/separator"
import { Ticket, UserCog, UserSquare2 } from "lucide-react"

const sidebarNavItems = [
  {
    icon: <UserSquare2 className="h-4 w-4 mr-2" />,
    title: "Profile",
    href: "/profile",
  },
  {
    icon: <Ticket className="h-4 w-4 mr-2" />,
    title: "Your ticket",
    href: "/profile/order-history",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="background-texture py-10">
      <Header />
      <div className="rounded-sm bg-white-500 block space-y-6 p-10 pb-16 md:block mt-20 max-w-6xl mx-auto">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight font-amsi">Your Information</h2>
          <p className="text-muted-foreground font-amsi">
            Manage your account settings and order history.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarProfile items={sidebarNavItems} />
          </aside>
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}