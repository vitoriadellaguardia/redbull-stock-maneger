const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { name, category, price, minStock } = req.body
    const product = await prisma.product.create({
      data: { name, category, price, minStock }
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, price, minStock } = req.body
    const product = await prisma.product.update({
      where: { id },
      data: { name, category, price, minStock }
    })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.product.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router