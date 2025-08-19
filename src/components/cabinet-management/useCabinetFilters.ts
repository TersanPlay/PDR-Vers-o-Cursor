import { useState, useEffect, useMemo } from 'react'
import { SortField, SortDirection } from './SortableHeader'
import { ViewMode, TableDensity } from './CabinetFilters'
import { Cabinet } from '@/types'

interface UseCabinetFiltersProps {
  cabinets: Cabinet[]
}

interface UseCabinetFiltersReturn {
  // Estados de filtro
  searchTerm: string
  statusFilter: string
  viewMode: ViewMode
  tableDensity: TableDensity
  
  // Estados de ordenação
  sortField: SortField | null
  sortDirection: SortDirection
  
  // Estados de paginação
  currentPage: number
  itemsPerPage: number
  
  // Dados processados
  filteredCabinets: Cabinet[]
  currentCabinets: Cabinet[]
  totalPages: number
  
  // Funções de controle
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setViewMode: (mode: ViewMode) => void
  setTableDensity: (density: TableDensity) => void
  handleSort: (field: SortField) => void
  handlePageChange: (page: number) => void
  handleItemsPerPageChange: (value: string) => void
  getDensityClasses: () => string
}

/**
 * Hook customizado para gerenciar filtros, ordenação e paginação de gabinetes
 */
export const useCabinetFilters = ({ cabinets }: UseCabinetFiltersProps): UseCabinetFiltersReturn => {
  // Estados de filtro
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [tableDensity, setTableDensity] = useState<TableDensity>('normal')
  
  // Estados de ordenação
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Função para ordenar gabinetes
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filtrar e ordenar gabinetes usando useMemo para performance
  const filteredCabinets = useMemo(() => {
    let filtered = cabinets

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(cabinet => 
        cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabinet.councilMemberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabinet.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabinet.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabinet.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(cabinet => cabinet.status === statusFilter)
    }

    // Aplicar ordenação se um campo estiver selecionado
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: string | Date
        let bValue: string | Date

        switch (sortField) {
          case 'name':
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case 'councilor':
            aValue = a.councilMemberName.toLowerCase()
            bValue = b.councilMemberName.toLowerCase()
            break
          case 'status':
            aValue = a.status
            bValue = b.status
            break
          case 'createdAt':
            aValue = new Date(a.createdAt)
            bValue = new Date(b.createdAt)
            break
          default:
            return 0
        }

        if (aValue < bValue) {
          return sortDirection === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [cabinets, searchTerm, statusFilter, sortField, sortDirection])

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, sortField, sortDirection])

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredCabinets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCabinets = filteredCabinets.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  // Função para obter classes de densidade da tabela
  const getDensityClasses = () => {
    switch (tableDensity) {
      case 'compact':
        return 'py-1 px-2 text-sm'
      case 'spacious':
        return 'py-4 px-4'
      default: // normal
        return 'py-2 px-3'
    }
  }

  return {
    // Estados de filtro
    searchTerm,
    statusFilter,
    viewMode,
    tableDensity,
    
    // Estados de ordenação
    sortField,
    sortDirection,
    
    // Estados de paginação
    currentPage,
    itemsPerPage,
    
    // Dados processados
    filteredCabinets,
    currentCabinets,
    totalPages,
    
    // Funções de controle
    setSearchTerm,
    setStatusFilter,
    setViewMode,
    setTableDensity,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
    getDensityClasses
  }
}