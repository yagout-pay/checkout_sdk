
"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center px-4 h-[7%] border-b">
      <Link href="/" className="text-lg font-bold hover:opacity-80">
        Yagout Pay
      </Link>
      <ProfileHeader />
    </header>
  );
};

const ProfileHeader = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      {/* Dark / Light Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="rounded-full"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </Button>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://i.pravatar.cc/150?u=nilaus" alt="Nilaus Mikaelson" />
            <AvatarFallback>NM</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="font-medium">Nilaus Mikaelson</p>
            <p className="text-xs text-muted-foreground">klaus@gmail.com</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;

