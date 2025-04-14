"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileImage,
  FileJson,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  CreditCard,
  BarChart2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  user?: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const NavItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
  }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-gray-100 text-gray-700"
        )}
        onClick={() => setIsOpen(false)}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    );
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "U";
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <div className="absolute left-4 top-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar content */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r shadow-sm p-4 flex flex-col transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-xl font-bold">FormSense</h1>
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              App
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem href="/dashboard" icon={FileImage} label="Form Images" />
          <NavItem
            href="/dashboard/templates"
            icon={FileJson}
            label="Extraction Templates"
          />

          {/* Add divider between main navigation items and account section */}
          <div className="pt-4 pb-2 mt-4 border-t border-gray-100">
            <p className="px-3 text-xs font-medium text-gray-500 uppercase">
              Account
            </p>
          </div>

          {/* Add three new navigation items */}
          <NavItem
            href="/dashboard/pricing"
            icon={CreditCard}
            label="Pricing Plans"
          />
          <NavItem
            href="/dashboard/usage"
            icon={BarChart2}
            label="Usage Stats"
          />
          <NavItem
            href="/dashboard/subscription"
            icon={Package}
            label="My Subscription"
          />
        </nav>

        <div className="border-t pt-4 mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p
                  className="font-medium truncate w-32"
                  title={user?.email || ""}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-xs text-gray-500">
            <p>FormSense Alpha Version</p>
          </div>
        </div>
      </aside>
    </>
  );
}
