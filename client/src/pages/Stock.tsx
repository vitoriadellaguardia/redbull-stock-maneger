import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Plus, ArrowUp, ArrowDown } from 'lucide-react'
import { StockMovement, Product } from '../types'

interface StockForm {
  productId: string
  type: 'entrada' | 'saida'
  quantity: number
  reason: string
}

export default function Stock() {
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: movements = [] } = useQuery({
    queryKey: ['stock-movements'],
    queryFn: () => fetch('/api/stock/movements').then(res => res.json()),
  })

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(res => res.json()),
  })

  const { register, handleSubmit, reset } = useForm<StockForm>()

  const createMovementMutation = useMutation({
    mutationFn: (movement: StockForm) =>
      fetch('/api/stock/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movement),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowForm(false)
      reset()
    },
  })

  const onSubmit = (data: StockForm) => {
    createMovementMutation.mutate(data)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Controle de Estoque</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-redbull-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Movimentação
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nova Movimentação</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <select
              {...register('productId', { required: true })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Selecione um produto</option>
              {products.map((product: Product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - Estoque atual: {product.stock}
                </option>
              ))}
            </select>
            
            <select
              {...register('type', { required: true })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Tipo de movimentação</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
            
            <input
              {...register('quantity', { required: true, valueAsNumber: true, min: 1 })}
              type="number"
              placeholder="Quantidade"
              className="border rounded-lg px-3 py-2"
            />
            
            <input
              {...register('reason', { required: true })}
              placeholder="Motivo da movimentação"
              className="border rounded-lg px-3 py-2"
            />
            
            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={createMovementMutation.isPending}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Registrar Movimentação
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movements.map((movement: any) => (
              <tr key={movement.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(movement.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{movement.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {movement.type === 'entrada' ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={movement.type === 'entrada' ? 'text-green-600' : 'text-red-600'}>
                      {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{movement.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{movement.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}