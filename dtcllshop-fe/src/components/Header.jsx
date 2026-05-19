import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const sessionAlive = sessionStorage.getItem("session_alive");

    if (!sessionAlive) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.setItem("session_alive", "true");
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        return;
      }
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("login", checkAuth);
    window.addEventListener("logout", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("login", checkAuth);
      window.removeEventListener("logout", checkAuth);
    };
  }, []);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cart, setCart] = useState(null);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`http://localhost:8080/accounts/myinfor`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.result);
      if (data.result?.id) {
        localStorage.setItem("accountId", data.result.id);
        localStorage.setItem("user", JSON.stringify(data.result));
      }
    } catch (error) {
      console.error("Lỗi fetch user", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/carts/account/${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCart(data.result);
    } catch (error) {
      console.error("Lỗi fetch cart: ", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user]);

  useEffect(() => {
    const handleCartUpdated = () => {
      if (user?.id) {
        fetchCart();
      }
    };
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          searchRef.current &&
          !searchRef.current.contains(event.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 1) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`http://localhost:8080/products`);
        if (response.ok) {
          const data = await response.json();
          const filtered = (data.result || [])
              .filter((product) =>
                  product.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, 5);
          setSearchResults(filtered);
          setShowDropdown(filtered.length > 0);
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm sản phẩm:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("logout"));
    navigate("/");
  };

  const handleProductClick = (productId) => {
    setSearchQuery("");
    setShowDropdown(false);
    setSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const isActive = (path) =>
      path === "/"
          ? location.pathname === "/"
          : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItems = [
    { to: "/", label: "Trang chủ" },
    { to: "/product", label: "Sản phẩm" },
    { to: "/about", label: "Thương hiệu" },
    { to: "/policy", label: "Dịch vụ" },
  ];

  return (
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f8f8f7]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[84px] items-center justify-between">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.05)] transition hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]">
                <img
                    src="/logo.png"
                    alt="DTCLL SHOP"
                    className="h-10 w-auto object-contain sm:h-12"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3 rounded-full border border-black/10 bg-white/90 px-3 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
              {navItems.map((item) => {
                const active = isActive(item.to);
                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] transition ${
                            active
                                ? "bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.20)]"
                                : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                    >
                      {item.label}
                    </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block" ref={searchRef}>
                {searchOpen ? (
                    <div className="relative">
                      <input
                          type="text"
                          placeholder="Tìm kiếm sản phẩm..."
                          className="w-56 lg:w-72 rounded-full border border-black/10 bg-white px-5 py-3 pr-10 text-sm text-black outline-none shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition focus:border-black"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                      />
                      <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-black"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                            setShowDropdown(false);
                          }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#333] shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition hover:bg-black hover:text-white"
                    >
                      <Search size={19} strokeWidth={2.2} />
                    </button>
                )}

                {showDropdown && searchResults.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute right-0 top-full mt-3 w-80 lg:w-96 overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
                    >
                      {isSearching && (
                          <div className="p-4 text-center text-sm text-gray-500">
                            Đang tìm kiếm...
                          </div>
                      )}

                      {!isSearching &&
                          searchResults.map((product) => (
                              <button
                                  key={product.id}
                                  onClick={() => handleProductClick(product.id)}
                                  className="flex w-full items-center gap-3 border-b border-black/5 p-3 text-left transition hover:bg-[#f7f7f7] last:border-b-0"
                              >
                                <img
                                    src={product.imageUrlFront}
                                    alt={product.name}
                                    className="h-16 w-16 rounded-2xl object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="line-clamp-2 text-sm font-semibold text-black">
                                      {product.name}
                                    </h4>
                                    {product.quantity === 0 && (
                                        <span className="whitespace-nowrap rounded-full bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                                HẾT HÀNG
                              </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm font-bold text-black">
                                    {formatPrice(product.price)}
                                  </p>
                                </div>
                              </button>
                          ))}
                    </div>
                )}
              </div>

              {/* Auth / User */}
              {isLoggedIn ? (
                  <>
                    <div className="relative group">
                      <button className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#333] shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition hover:bg-black hover:text-white">
                        <User size={19} strokeWidth={2.2} />
                      </button>

                      <div className="invisible absolute right-0 mt-3 w-56 translate-y-2 overflow-hidden rounded-[24px] border border-black/10 bg-white opacity-0 shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
                        <Link
                            to="/profile"
                            className="block px-4 py-3 text-sm font-medium text-black transition hover:bg-[#f7f7f7]"
                        >
                          Hồ sơ
                        </Link>
                        <Link
                            to="/wishlists"
                            className="block px-4 py-3 text-sm font-medium text-black transition hover:bg-[#f7f7f7]"
                        >
                          Danh sách yêu thích
                        </Link>
                        <Link
                            to="/orders"
                            onClick={() => {
                              localStorage.setItem("userId", user.id);
                            }}
                            className="block px-4 py-3 text-sm font-medium text-black transition hover:bg-[#f7f7f7]"
                        >
                          Đơn hàng của tôi
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-black transition hover:bg-[#f7f7f7]"
                        >
                          <LogOut size={16} />
                          Đăng xuất
                        </button>
                      </div>
                    </div>

                    <button
                        onClick={() => navigate("/cart")}
                        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#333] shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition hover:bg-black hover:text-white"
                    >
                      <ShoppingCart size={19} strokeWidth={2.2} />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                    {cart?.totalQuantity || 0}
                  </span>
                    </button>
                  </>
              ) : (
                  <div className="hidden sm:flex items-center gap-2 rounded-full border border-black/10 bg-white p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                    <Link
                        to="/login"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                        to="/register"
                        className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-black transition hover:bg-[#f2f2f2]"
                    >
                      Đăng ký
                    </Link>
                  </div>
              )}

              {/* Mobile Menu Button */}
              <button
                  className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#333] shadow-[0_10px_24px_rgba(0,0,0,0.04)] transition hover:bg-black hover:text-white"
                  onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? (
                    <X size={22} strokeWidth={2.2} />
                ) : (
                    <Menu size={22} strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
              <nav className="lg:hidden border-t border-black/10 pb-5 pt-4">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const active = isActive(item.to);
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition ${
                                active
                                    ? "bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.20)]"
                                    : "bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                        >
                          {item.label}
                          {active && <span>•</span>}
                        </Link>
                    );
                  })}

                  {!isLoggedIn && (
                      <div className="flex flex-col gap-2 pt-3">
                        <Link
                            to="/login"
                            className="rounded-full bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
                            onClick={() => setMenuOpen(false)}
                        >
                          Đăng nhập
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-full border border-black/10 bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-[#f2f2f2]"
                            onClick={() => setMenuOpen(false)}
                        >
                          Đăng ký
                        </Link>
                      </div>
                  )}

                  {isLoggedIn && (
                      <div className="mt-3 border-t border-black/10 pt-3">
                        <Link
                            to="/profile"
                            className="block rounded-2xl px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f7f7f7]"
                            onClick={() => setMenuOpen(false)}
                        >
                          Hồ sơ
                        </Link>
                        <Link
                            to="/orders"
                            className="block rounded-2xl px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f7f7f7]"
                            onClick={() => setMenuOpen(false)}
                        >
                          Đơn hàng của tôi
                        </Link>
                        <button
                            onClick={() => {
                              handleLogout();
                              setMenuOpen(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-black transition hover:bg-[#f7f7f7]"
                        >
                          <LogOut size={16} />
                          Đăng xuất
                        </button>
                      </div>
                  )}

                  {/* Mobile Search */}
                  <div className="pt-3 sm:hidden">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {showDropdown && searchResults.length > 0 && (
                        <div className="mt-3 overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.10)]">
                          {searchResults.map((product) => (
                              <button
                                  key={product.id}
                                  onClick={() => {
                                    handleProductClick(product.id);
                                    setMenuOpen(false);
                                  }}
                                  className="flex w-full items-center gap-3 border-b border-black/5 p-3 text-left transition hover:bg-[#f7f7f7] last:border-b-0"
                              >
                                <img
                                    src={product.imageUrlFront}
                                    alt={product.name}
                                    className="h-12 w-12 rounded-xl object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="line-clamp-2 text-xs font-semibold text-black">
                                      {product.name}
                                    </h4>
                                    {product.quantity === 0 && (
                                        <span className="rounded-full bg-black px-1.5 py-0.5 text-[10px] font-bold text-white">
                                HẾT HÀNG
                              </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-xs font-bold text-black">
                                    {formatPrice(product.price)}
                                  </p>
                                </div>
                              </button>
                          ))}
                        </div>
                    )}
                  </div>
                </div>
              </nav>
          )}
        </div>
      </header>
  );
}



