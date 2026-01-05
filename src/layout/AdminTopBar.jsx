import React, { useState } from "react";
import { Menu, Users, Package, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

export default function AdminTopBar() {
  return (
    <nav className="container p-0 sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex gap-6 items-center">
            <Link to="/admin/dashboard" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:shadow-[var(--shadow-soft)] transition-all">
                <Home className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline-block">
                AdminPanel
              </span>
            </Link>

            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              Home
            </Link>
          </div>

          {/* Admin Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/admin/dashboard"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/orders"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              Orders
            </Link>
            <Link
              to="/admin/products"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              Products
            </Link>
            <Link
              to="/admin/categories"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              categories
            </Link>
            <Link
              to="/admin/users"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              Users
            </Link>
            <Link
              to="/admin/settings"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              Settings
            </Link>
          </div>

          <div className="lg:hidden">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                {/* Mobile Menu Button */}
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>  <Link
                    to="/admin/orders"
                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Orders
                  </Link> </DropdownMenuItem>
                  <DropdownMenuItem>  <Link
                    to="/admin/products"
                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Products
                  </Link> </DropdownMenuItem>
                  <DropdownMenuItem>    <Link
                    to="/admin/categories"
                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  >
                    categories
                  </Link> </DropdownMenuItem>
                  <DropdownMenuItem>  <Link
                    to="/admin/users"
                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Users
                  </Link> </DropdownMenuItem>
                  <DropdownMenuItem>  <Link
                    to="/admin/settings"
                    className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Settings
                  </Link> </DropdownMenuItem>

                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

      </div>
    </nav>
  );
}


