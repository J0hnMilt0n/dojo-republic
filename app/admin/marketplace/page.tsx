'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Package,
  Store,
  Search,
  Filter
} from 'lucide-react';

export default function AdminMarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sellers, setSellers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sellers' | 'products'>('sellers');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      
      if (data.user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(data.user);
      await Promise.all([fetchSellers(), fetchProducts()]);
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      // Note: This endpoint needs to be created or updated
      const res = await fetch('/api/products?type=sellers');
      if (res.ok) {
        const data = await res.json();
        setSellers(data.sellers || []);
      }
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  if (!user) return null;

  const pendingSellers = sellers.filter(s => !s.isApproved);
  const approvedSellers = sellers.filter(s => s.isApproved);
  const pendingProducts = products.filter(p => !p.isApproved);
  const approvedProducts = products.filter(p => p.isApproved);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Marketplace</h1>
          <p className="text-gray-600 mt-1">Manage sellers and products</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Sellers</p>
            <p className="text-3xl font-bold text-gray-900">{sellers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Sellers</p>
            <p className="text-3xl font-bold text-orange-600">{pendingSellers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Products</p>
            <p className="text-3xl font-bold text-orange-600">{pendingProducts.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('sellers')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'sellers'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Store className="w-4 h-4 inline mr-2" />
                Sellers ({sellers.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === 'products'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Products ({products.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'sellers' ? (
              <div>
                {sellers.length === 0 ? (
                  <div className="text-center py-12">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No sellers found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellers.map((seller) => (
                      <div key={seller.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{seller.businessName}</h3>
                          {seller.isApproved ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{seller.description}</p>
                        <p className="text-xs text-gray-500">{seller.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No products found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          {product.isApproved ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">${product.price}</span>
                          <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
