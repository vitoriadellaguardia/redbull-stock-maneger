import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Sale, Product } from '../types'

interface SaleForm {
  productId: string
  quantity: number
  customerName?: string
}

export default function Sales() {
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => fetch('/api/sales').then(res => res.json()),
  })

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(res => res.json()),
  })

  const { register, handleSubmit, reset, watch } = useForm<SaleForm>()
  const selectedProductId = watch('productId')
  const selectedProduct = products.find((p: Product) => p.id === selectedProductId)

  const createSaleMutation = useMutation({
    mutationFn: (sale: SaleForm) =>
      fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowForm(false)
      reset()
    },
  })

  const onSubmit = (data: SaleForm) => {
    createSaleMutation.mutate(data)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-redbull-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Venda
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nova Venda</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <select
              {...register('productId', { required: true })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Selecione um produto</option>
              {products.map((product: Product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - Estoque: {product.stock}
                </option>
              ))}
            </select>
            
            <input
              {...register('quantity', { required: true, valueAsNumber: true, min: 1 })}
              type="number"
              placeholder="Quantidade"
              max={selectedProduct?.stock || 0}
              className="border rounded-lg px-3 py-2"
            />
            
            <input
              {...register('customerName')}
              placeholder="Nome do cliente (opcional)"
              className="border rounded-lg px-3 py-2"
            />
            
            {selectedProduct && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Preço unitário: R$ {selectedProduct.price}</p>
                <p className="font-semibold">
                  Total: R$ {(selectedProduct.price * (watch('quantity') || 0)).toFixed(2)}
                </p>
              </div>
            )}
            
            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={!selectedProduct || createSaleMutation.isPending}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Registrar Venda
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  reset()
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map((sale: any) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(sale.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{sale.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.customerName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                  R$ {sale.totalPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}