'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?approved=true');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Martial Arts Marketplace</h1>
          <p className="text-base sm:text-lg text-gray-200 font-light">
            Quality equipment and gear for your training
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="bg-linear-to-b from-gray-50 to-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-4 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent text-lg transition-all"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No products available</p>
              <p className="mt-2 text-gray-500">Check back soon for new items</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:scale-105 transform overflow-hidden">
      {/* Gradient accent on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-red-500/0 to-red-600/0 group-hover:from-red-500/5 group-hover:to-red-600/5 rounded-2xl transition-all duration-300"></div>
      
      <div className="h-56 bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
        </div>
        <ShoppingCart className="w-20 h-20 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="p-6 relative">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1 tracking-tight">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-extrabold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          <button className="bg-linear-to-r from-red-600 to-red-800 text-white px-5 py-2.5 rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-red-500/50 hover:scale-105 transform">
            Add to Cart
          </button>
        </div>

        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-orange-600 font-medium">
            Only {product.stock} left in stock
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-600 font-semibold">
            Out of Stock
          </p>
        )}
      </div>
    </div>
  );
}

