import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  DollarSign,
  Grid3x3,
  List,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const Product = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setXemMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grid" ? 9 : 9;

  const { hotProductIds, newProductIds } = useMemo(() => {
    if (products.length === 0) return { hotProductIds: [], newProductIds: [] };

    const sortedBySold = [...products].sort(
        (a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0)
    );
    const top5Hot = sortedBySold.slice(0, 5).map((p) => p.id);

    const sortedByDate = [...products].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    const top5New = sortedByDate.slice(0, 5).map((p) => p.id);

    return {
      hotProductIds: top5Hot,
      newProductIds: top5New,
    };
  }, [products]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sortParam = params.get("sort");
    if (sortParam === "bestselling" || sortParam === "newest") {
      setSortBy(sortParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.result || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.result || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, viewMode, searchTerm, priceRange]);

  const processedProducts = useMemo(() => {
    let filtered = [...products];

    filtered = filtered.filter((p) => p.status === "ACTIVE");

    if (searchTerm) {
      filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      const catId = parseInt(selectedCategory);
      filtered = filtered.filter((p) => p.category?.id === catId);
    }

    filtered = filtered.filter(
        (p) => p.costPrice >= priceRange[0] && p.costPrice <= priceRange[1]
    );

    filtered.sort((a, b) => {
      const stockA = a.quantity > 0 ? 0 : 1;
      const stockB = b.quantity > 0 ? 0 : 1;
      if (stockA !== stockB) return stockA - stockB;

      switch (sortBy) {
        case "price-low":
          // Sắp xếp giá từ thấp đến cao
          return a.costPrice - b.costPrice;
        case "price-high":
          // Sắp xếp giá từ cao đến thấp
          return b.costPrice - a.costPrice;
        case "newest":
          // Sản phẩm mới nhất lên đầu
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "bestselling":
          // Sản phẩm bán chạy nhất
          return (b.soldQuantity || 0) - (a.soldQuantity || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const sortOptions = [
    { value: "default", label: "Sắp xếp mặc định" },
    { value: "price-low", label: "Giá: thấp đến cao" },
    { value: "price-high", label: "Giá: cao đến thấp" },
    { value: "newest", label: "Mới nhất trước" },
    { value: "bestselling", label: "Bán chạy nhất" },
  ];

  return (
      <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
        {/* Header section mới, vẫn chỉ là UI */}
        <section className="border-b border-slate-200 bg-blue-50/45">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                  DTCLL SHOP • DANH MỤC
                </p>
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Khám phá thời trang
                  <span className="block text-blue-700">theo cách riêng</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Khám phá toàn bộ bộ sưu tập với trải nghiệm duyệt sản phẩm rõ ràng,
                  bố cục gọn gàng và cách trình bày hiện đại.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-[24px] border border-blue-100 bg-white p-5 text-center shadow-sm">
                  <div className="text-3xl font-bold">{products.length}+</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Sản phẩm
                  </div>
                </div>
                <div className="rounded-[24px] border border-blue-100 bg-white p-5 text-center shadow-sm">
                  <div className="text-3xl font-bold">{categories.length}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Danh mục
                  </div>
                </div>
                <div className="rounded-[24px] border border-blue-100 bg-white p-5 text-center shadow-sm">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Chất lượng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Top controls block mới */}
          <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_260px_auto] xl:items-center">
              {/* Search */}
              <div className="relative">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                />
                <input
                    type="text"
                    placeholder="Tìm trong danh mục..."
                    className="w-full rounded-full border border-[#E0E0E0] bg-[#F9F9F9] py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                    className="appearance-none w-full rounded-full border border-[#E0E0E0] bg-[#F9F9F9] px-4 py-3 pr-11 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                  ))}
                </select>
                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>

              {/* Xem mode */}
              <div className="inline-flex w-fit rounded-full border border-slate-200 bg-blue-50 p-1.5">
                <button
                    onClick={() => setXemMode("grid")}
                    className={`rounded-full px-4 py-2.5 transition ${
                        viewMode === "grid"
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:bg-white hover:text-blue-700"
                    }`}
                    title="Dạng lưới"
                >
                  <Grid3x3 size={17} />
                </button>
                <button
                    onClick={() => setXemMode("list")}
                    className={`rounded-full px-4 py-2.5 transition ${
                        viewMode === "list"
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:bg-white hover:text-blue-700"
                    }`}
                    title="Dạng danh sách"
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            {/* Sidebar mới */}
            <aside className="space-y-6">
              {/* Categories */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-950">
                  <Folder size={18} className="text-blue-700" />
                  Danh mục
                </h3>

                <div className="flex flex-col gap-2">
                  <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                          selectedCategory === "all"
                              ? "bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)]"
                              : "bg-[#F9F9F9] text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                  >
                    Tất cả sản phẩm
                  </button>

                  {categories.map((category) => (
                      <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id.toString())}
                          className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                              selectedCategory === category.id.toString()
                                  ? "bg-blue-600 text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)]"
                                  : "bg-[#F9F9F9] text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                      >
                        {category.name}
                      </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-950">
                  <DollarSign size={18} className="text-blue-700" />
                  Khoảng giá
                </h3>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center">
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Khoảng giá đã chọn
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-950">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="50000"
                      value={priceRange[0]}
                      onChange={(e) =>
                          setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full h-2 cursor-pointer appearance-none rounded-lg bg-blue-100 accent-blue-600"
                  />
                  <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="50000"
                      value={priceRange[1]}
                      onChange={(e) =>
                          setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 cursor-pointer appearance-none rounded-lg bg-blue-100 accent-blue-600"
                  />
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main>
              {/* Result info */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                    Kết quả sản phẩm
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, processedProducts.length)}{" "}
                    trên {processedProducts.length} sản phẩm
                  </p>
                </div>

                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                  Kiểu hiển thị:{" "}
                  <span className="font-semibold text-blue-700">
                  {viewMode === "grid" ? "Dạng lưới" : "Dạng danh sách"}
                </span>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                  <div className="flex h-64 items-center justify-center">
                    <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                  </div>
              )}

              {/* Products */}
              {!loading && paginatedProducts.length > 0 && (
                  <>
                    <div
                        className={
                          viewMode === "grid"
                              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                              : "flex flex-col gap-6"
                        }
                    >
                      {paginatedProducts.map((product) => {
                        const isHot = hotProductIds.includes(product.id);
                        const isNew = newProductIds.includes(product.id);

                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isHot={isHot}
                                isNew={isNew && !isHot}
                                viewMode={viewMode}
                            />
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                          <button
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                                  currentPage === 1
                                      ? "cursor-not-allowed border-gray-300 text-gray-400"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                          >
                            <ChevronLeft size={18} />
                          </button>

                          {[...Array(totalPages)].map((_, i) => (
                              <button
                                  key={i + 1}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`h-11 min-w-[44px] rounded-full px-4 text-sm font-semibold transition ${
                                      currentPage === i + 1
                                          ? "bg-blue-600 text-white"
                                          : "border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                                  }`}
                              >
                                {i + 1}
                              </button>
                          ))}

                          <button
                              onClick={() =>
                                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                              }
                              disabled={currentPage === totalPages}
                              className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                                  currentPage === totalPages
                                      ? "cursor-not-allowed border-gray-300 text-gray-400"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              }`}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                    )}
                  </>
              )}

              {/* Trống state */}
              {!loading && processedProducts.length === 0 && (
                  <div className="rounded-[32px] border border-dashed border-blue-200 bg-white px-6 py-20 text-center shadow-sm">
                    <div className="mb-5 text-gray-400">
                      <Search size={56} className="mx-auto" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-950">
                      Không tìm thấy sản phẩm
                    </h3>
                    <p className="mt-4 text-slate-600">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                    </p>
                  </div>
              )}
            </main>
          </div>

          <ChatBot />
          <Contact />
        </div>
      </div>
  );
};

export default Product;
