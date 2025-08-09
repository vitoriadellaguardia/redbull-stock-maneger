const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    // Vendas de hoje
    const todaySales = await prisma.sale.aggregate({
      where: {
        date: { gte: today }
      },
      _sum: { totalPrice: true }
    })
    
    // Vendas do mês
    const monthSales = await prisma.sale.aggregate({
      where: {
        date: { gte: startOfMonth }
      },
      _sum: { totalPrice: true }
    })
    
    // Total de produtos
    const totalProducts = await prisma.product.count()
    
    // Produtos com estoque baixo
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.minStock }
      },
      select: { id: true, name: true, stock: true, minStock: true }
    })
    
    // Vendas recentes (últimas 5)
    const recentSales = await prisma.sale.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        product: { select: { name: true } }
      }
    })
    
    const recentSalesWithProductName = recentSales.map(sale => ({
      ...sale,
      productName: sale.product.name
    }))
    
    res.json({
      todaySales: todaySales._sum.totalPrice || 0,
      monthSales: monthSales._sum.totalPrice || 0,
      totalProducts,
      lowStock: lowStockProducts.length,
      lowStockProducts,
      recentSales: recentSalesWithProductName
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router