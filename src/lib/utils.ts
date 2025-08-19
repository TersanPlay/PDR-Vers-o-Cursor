import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitário para combinar classes CSS com Tailwind CSS
 * @param inputs Classes CSS para combinar
 * @returns String com classes combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um valor monetário para exibição
 * @param value Valor numérico
 * @param currency Moeda (padrão: BRL)
 * @returns String formatada
 */
export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value)
}

/**
 * Formata uma data para exibição
 * @param date Data para formatar
 * @param options Opções de formatação
 * @returns String formatada
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', options).format(dateObj)
}

/**
 * Formata uma data e hora para exibição
 * @param date Data para formatar
 * @returns String formatada
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Gera uma cor baseada em uma string (útil para avatares)
 * @param str String para gerar cor
 * @returns Cor em formato HSL
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

/**
 * Debounce function para otimizar performance
 * @param func Função para fazer debounce
 * @param wait Tempo de espera em ms
 * @returns Função com debounce aplicado
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function para limitar execuções
 * @param func Função para fazer throttle
 * @param limit Limite de tempo em ms
 * @returns Função com throttle aplicado
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Gera um ID único simples
 * @param prefix Prefixo opcional
 * @returns ID único
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substr(2, 9)
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`
}

/**
 * Converte bytes para formato legível
 * @param bytes Número de bytes
 * @param decimals Casas decimais
 * @returns String formatada
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Capitaliza a primeira letra de cada palavra
 * @param str String para capitalizar
 * @returns String capitalizada
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Remove acentos de uma string
 * @param str String com acentos
 * @returns String sem acentos
 */
export function removeAccents(str: string): string {
  return str.replace(/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/gi, (match) => {
    const accents = 'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ'
    const normal = 'aaaaaaaceeeeiiiidnooooooouuuuyby'
    return normal[accents.indexOf(match.toLowerCase())]
  })
}

/**
 * Verifica se uma string é um JSON válido
 * @param str String para verificar
 * @returns True se for JSON válido
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}