import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetch('/api/dashboard/stats').then(res => res.json()),
  })

  const cards = [
    {
      title: 'Vendas Hoje',
      value: stats?.todaySales || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Produtos em Estoque',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Estoque Baixo',
      value: stats?.lowStock || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      title: 'Vendas do Mês',
      value: stats?.monthSales || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${card.bg} ${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Produtos com Estoque Baixo</h2>
          <div className="space-y-3">
            {stats?.lowStockProducts?.map((product: any) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="font-medium">{product.name}</span>
                <span className="text-red-600 font-bold">{product.stock} unidades</span>
              </div>
            )) || <p className="text-gray-500">Nenhum produto com estoque baixo</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Vendas Recentes</h2>
          <div className="space-y-3">
            {stats?.recentSales?.map((sale: any) => (
              <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{sale.productName}</p>
                  <p className="text-sm text-gray-500">{sale.quantity} unidades</p>
                </div>
                <span className="font-bold text-green-600">R$ {sale.totalPrice}</span>
              </div>
            )) || <p className="text-gray-500">Nenhuma venda recente</p>}
          </div>
        </div>
      </div>
    </div>
  )
}