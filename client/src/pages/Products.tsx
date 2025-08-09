import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Product } from '../types'

export default function Products() {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(res => res.json()),
  })

  const { register, handleSubmit, reset, setValue } = useForm<Product>()

  const createMutation = useMutation({
    mutationFn: (product: Omit<Product, 'id'>) =>
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowForm(false)
      reset()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...product }: Product) =>
      fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setEditingProduct(null)
      setShowForm(false)
      reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const onSubmit = (data: Product) => {
    if (editingProduct) {
      updateMutation.mutate({ ...data, id: editingProduct.id })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setValue('name', product.name)
    setValue('category', product.category)
    setValue('price', product.price)
    setValue('minStock', product.minStock)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-redbull-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <input
              {...register('name', { required: true })}
              placeholder="Nome do produto"
              className="border rounded-lg px-3 py-2"
            />
            <input
              {...register('category', { required: true })}
              placeholder="Categoria"
              className="border rounded-lg px-3 py-2"
            />
            <input
              {...register('price', { required: true, valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="Preço"
              className="border rounded-lg px-3 py-2"
            />
            <input
              {...register('minStock', { required: true, valueAsNumber: true })}
              type="number"
              placeholder="Estoque mínimo"
              className="border rounded-lg px-3 py-2"
            />
            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {editingProduct ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null)
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product: Product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.stock <= product.minStock 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">R$ {product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}