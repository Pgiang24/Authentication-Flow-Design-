import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Star, ShoppingCart, Zap, Clock, Shield, Leaf, ChevronLeft, Check, Tag, Plus, Minus } from "lucide-react";
import { PRODUCTS, formatPrice } from "../../data/products";
import { useCart } from "../../context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = PRODUCTS.find((p) => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Product not found</h2>
        <Link to="/customer" className="text-[#7C2D12] hover:underline">Back to shop</Link>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const inStock = variant.stock > 0;

  const handleAddToCart = () => {
    addToCart(product, variant.weight, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, variant.weight, quantity);
    navigate("/customer/cart");
  };

  const checkPromo = () => {
    const valid: Record<string, number> = { ALEFARMS10: 10, WELCOME20: 20, SUMMER15: 15 };
    const upper = promoInput.toUpperCase();
    if (valid[upper]) {
      setPromoMsg({ text: `✅ Code applied! ${valid[upper]}% discount at checkout`, ok: true });
    } else {
      setPromoMsg({ text: "❌ Invalid promo code. Try ALEFARMS10", ok: false });
    }
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.featured)).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/customer" className="hover:text-[#7C2D12] flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> All Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-[#7C2D12]" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 bg-[#7C2D12]/10 text-[#7C2D12] text-xs rounded-full font-medium capitalize">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-[#D4A853] text-[#D4A853]" : "text-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl">
            <div className="text-3xl font-bold text-[#7C2D12]">{formatPrice(variant.price)}</div>
            <div className="text-sm text-gray-500 mt-1">for {variant.weight}</div>
          </div>

          {/* Weight Selection */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Weight / Quantity</label>
            <div className="flex gap-2 flex-wrap">
              {product.variants.map((v, i) => (
                <button
                  key={v.weight}
                  onClick={() => setSelectedVariant(i)}
                  disabled={v.stock === 0}
                  className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedVariant === i
                      ? "border-[#7C2D12] bg-[#7C2D12] text-white"
                      : v.stock === 0
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-700 hover:border-[#7C2D12] hover:text-[#7C2D12]"
                  }`}
                >
                  {v.weight}
                  {v.stock === 0 && <span className="ml-1 text-xs opacity-70">(Out)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-[#7C2D12] hover:text-[#7C2D12] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-semibold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(variant.stock, quantity + 1))}
                disabled={quantity >= variant.stock}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-[#7C2D12] hover:text-[#7C2D12] transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-500">{inStock ? `${variant.stock} available` : "Out of stock"}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border-2 ${
                added
                  ? "bg-[#2D6A4F] border-[#2D6A4F] text-white"
                  : inStock
                  ? "bg-white border-[#7C2D12] text-[#7C2D12] hover:bg-[#7C2D12] hover:text-white"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              {added ? "Added!" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className={`flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                inStock
                  ? "bg-[#7C2D12] text-white hover:bg-[#6B2510] active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Zap className="w-4 h-4" /> Buy Now
            </button>
          </div>

          {/* Promo Code */}
          <div className="p-4 bg-[#D4A853]/10 border border-[#D4A853]/30 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-[#D4A853]" />
              <span className="text-sm font-semibold text-gray-700">Have a promo code?</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter code (e.g. ALEFARMS10)"
                className="flex-1 px-3 py-2 rounded-xl border border-[#D4A853]/30 bg-white text-sm outline-none focus:border-[#D4A853]"
              />
              <button
                onClick={checkPromo}
                className="px-4 py-2 bg-[#D4A853] text-white rounded-xl text-sm font-medium hover:bg-[#C19442] transition-colors"
              >
                Apply
              </button>
            </div>
            {promoMsg && (
              <p className={`text-xs mt-2 ${promoMsg.ok ? "text-[#2D6A4F]" : "text-red-500"}`}>{promoMsg.text}</p>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label: "Prep Time", value: product.preparationTime },
              { icon: Shield, label: "Certified", value: "VSATTP" },
              { icon: Leaf, label: "Natural", value: "No additives" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-3 bg-gray-50 rounded-xl">
                <Icon className="w-5 h-5 text-[#7C2D12] mx-auto mb-1" />
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-xs font-medium text-gray-700 mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description + Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">About This Product</h2>
          <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Certifications</h2>
          <div className="space-y-2">
            {product.certifications.map((c) => (
              <div key={c} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#2D6A4F]" />
                </div>
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedProducts.map((p) => {
              const v = p.variants[0];
              const inS = p.variants.some((pv) => pv.stock > 0);
              return (
                <Link key={p.id} to={`/customer/product/${p.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#7C2D12] transition-colors">{p.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[#7C2D12]">{formatPrice(v.price)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${inS ? "bg-[#2D6A4F]/10 text-[#2D6A4F]" : "bg-gray-100 text-gray-500"}`}>
                        {inS ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
