const copFormat = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
})

const copFormatDecimals = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const inputNumberFormat = new Intl.NumberFormat('es-CO', {
  useGrouping: true,
  maximumFractionDigits: 0,
})

export function useCurrencyFormat() {
  function formatCOP(value: number): string {
    return copFormat.format(value)
  }

  function formatCOPDecimals(value: number): string {
    return copFormatDecimals.format(value)
  }

  function formatInputNumber(value: number): string {
    return inputNumberFormat.format(value)
  }

  return { formatCOP, formatCOPDecimals, formatInputNumber }
}
