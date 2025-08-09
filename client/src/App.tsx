import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Stock from './pages/Stock'
import { LoginPage } from './pages/Login'
import DrinksTableExample from './pages/Listagem'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/lista" element={<DrinksTableExample />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App