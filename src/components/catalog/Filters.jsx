import './Filters.css'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../../lib/http'

const Filters = () => {
  const [query, setQuery] = useState('')
  // const [category, setCategory] = useState('Todas')
  const [sort, setSort] = useState('Relevancia')

  const [category, setCategory] = useState('Todas')

  //cargar las categorias desde el backend
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['categories'], // cache key
    queryFn: () => fetcher('product/base/categories'), 
    staleTime: 1000 * 60 * 5, 
  })

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

      <button className="filter-btn">
        Filtrar
      </button>
    </div>
  )
}

export default Filters
