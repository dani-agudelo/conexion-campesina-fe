import './Filters.css'
import { useState } from 'react'
import { Search } from 'lucide-react'

const Filters = ({ changeFilters }) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [sort, setSort] = useState('Relevancia')

  const handleFilter = () => {
    changeFilters({ query, category, sort })
  }

  return (
    <div className="filters-bar">
      <div className="search-box">
        <Search size={18} color="#777" />
        <input
          type="text"
          placeholder="Buscar por producto o productor..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Todas">Categoría</option>
        <option value="Granos">Granos</option>
        <option value="Frutas">Frutas</option>
        <option value="Verduras">Verduras</option>
        <option value="Lácteos">Lácteos</option>
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="Relevancia">Relevancia</option>
        <option value="PrecioAsc">Precio más bajo</option>
        <option value="PrecioDesc">Precio más alto</option>
        <option value="NombreAZ">Nombre (A-Z)</option>
      </select>

      <button className="filter-btn" onClick={handleFilter}>
        Filtrar
      </button>
    </div>
  )
}

export default Filters
