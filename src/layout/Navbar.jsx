import {
  ShoppingCart,
  Search,
  Leaf,
  Menu
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import ProfileMenu from "@/components/ProfileMenu";
import { getAllCarts, getSearchSuggestions } from "@/service/userService";
import { Card } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { cn } from "@/lib/utils";
import TopNavigations from "@/components/TopNavigations";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const user = useAuthStore(s => s.user)
  const toggleProfileDetails = useAuthStore(s => s.toggleProfileDetails)
  const { search, setSearch, debouncedSearch, setDebouncedSearch, setSearchQuery } = useAuthStore();

  const [openMenu, setOpenMenu] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [carts, setCarts] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const data = await getSearchSuggestions(debouncedSearch, 6);
        setSuggestions(data);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedSearch]);

  const handleKeyDown = (e) => {

    if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSearch(suggestions[activeIndex]);
    }
  };

  const handleSearch = (text) => {
    if (!text) return;

    setSearch(text);
    setSearchQuery(text);
    setSuggestions([]);
    setActiveIndex(-1);

    navigate(`/products?search=${encodeURIComponent(text)}`);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCarts = async () => {
      const items = await getAllCarts();
      setCarts(items)
    }
    fetchCarts();
  }, [isAuthenticated])

  const SearchDropdown = () => (
    <Card className=" absolute mt-2 w-full shadow-lg z-50">
      <ScrollArea className="max-h-72">
        {suggestions.map((text, i) => (
          <div
            key={i}
            role="option"
            aria-selected={i === activeIndex}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => handleSearch(text)}
            className={cn(
              "flex items-center gap-3 p-3 cursor-pointer",
              i === activeIndex
                ? "bg-muted text-primary"
                : "hover:bg-muted"
            )}
          >
            <p className="text-sm font-medium">{text}</p>
          </div>
        ))}
      </ScrollArea>
    </Card >
  );

  return (
    <nav className="sticky top-0 z-50 container w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container relative px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}

          <div className="flex gap-6 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:shadow-[var(--shadow-soft)] transition-all">
                <Leaf className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline-block">
                FreshMart
              </span>
            </Link>

            {user?.roles?.includes('ADMIN') && (
              <Link
                to="/admin/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Admin
              </Link>
            )}

          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="relative hidden md:block w-full max-w-md mx-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (search.trim()) {
                  handleSearch(search.trim());
                }
              }}
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  enterKeyHint="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search fresh produce..."
                  className="pl-10"
                />
              </div>
            </form>

            {/* Search Dropdown */}
            {suggestions.length > 0 && <SearchDropdown />}
          </div>

          {/* TopNavigations Links */}
          <div className="flex items-center gap-4">

            <div className="hidden lg:flex items-center">
              <TopNavigations />
            </div>

            {isAuthenticated ? (
              <Link to="/me/profile" className='w-full'>
                <Button variant="outline" size="default" className="relative"
                  onClick={toggleProfileDetails}
                >
                  Hello {user?.name?.trim().split(" ")[0]}
                </Button>
              </Link>
            ) : (
              <Link to="/verify/login">
                <Button variant="outline" size="default" className="relative">
                  Login
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {carts > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-secondary-foreground">
                    {carts}
                  </Badge>
                )}
              </Button>
            </Link>

            <div className="">
              <DropdownMenu open={openMenu} onOpenChange={setOpenMenu} modal={false}>
                <DropdownMenuTrigger asChild>
                  {/* Mobile Menu Button */}
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <ProfileMenu />

              </DropdownMenu>
            </div>

          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) {
                handleSearch(search.trim());
              }
            }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                enterKeyHint="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search fresh produce..."
                className="pl-10"
              />
            </div>

            {suggestions.length > 0 && <SearchDropdown />}
          </form>
        </div>

      </div>
    </nav >
  );
};