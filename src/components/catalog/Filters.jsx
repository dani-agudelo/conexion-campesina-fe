import './Filters.css'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../../lib/http'
import { useFilters } from '../../state/filters'
import { useState } from 'react'

const Filters = () => {
  const { query, setQuery, category, setCategory, sort, setSort } = useFilters()
  const [localQuery, setLocalQuery] = useState(query)
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetcher('product/base/categories'),
    staleTime: 1000 * 60 * 5,
  })

  const handleFilter = () => {
    // Aplica el texto escrito en el buscador al estado global
    setQuery(localQuery)
  }

  return (
    <div className="filters-bar">
      <div className="search-box">
        <Search size={18} color="#777" />
        <input
          type="text"
          placeholder="Buscar por producto o productor..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isLoading || isError}
      >
        <option value="Todas">Todas las categorías</option>

        {isLoading && <option>Cargando...</option>}
        {isError && <option>Error al cargar</option>}

        {!isLoading &&
          !isError &&
          categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0) + cat.slice(1).toLowerCase().replaceAll('_', ' ')}
            </option>
          ))}
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
