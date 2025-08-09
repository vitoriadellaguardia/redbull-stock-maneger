import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Package, ShoppingCart, Warehouse } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Produtos', href: '/products', icon: Package },
    { name: 'Vendas', href: '/sales', icon: ShoppingCart },
    { name: 'Estoque', href: '/stock', icon: Warehouse },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-redbull-blue shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Red Bull Stock</h1>
            </div>
            <div className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'text-redbull-yellow bg-redbull-blue/20'
                        : 'text-white hover:text-redbull-yellow'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  )
}