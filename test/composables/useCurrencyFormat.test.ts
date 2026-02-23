import { describe, it, expect } from 'vitest'
import { useCurrencyFormat } from '../../src/composables/useCurrencyFormat'

describe('useCurrencyFormat', () => {
  const { formatCOP, formatCOPDecimals } = useCurrencyFormat()

  describe('formatCOP', () => {
    it('returns a string', () => {
      expect(typeof formatCOP(5000000)).toBe('string')
    })

    it('includes the currency symbol', () => {
      expect(formatCOP(1000)).toContain('$')
    })

    it('formats zero', () => {
      expect(formatCOP(0)).toMatch(/0/)
    })

    it('formats a whole number without decimal places', () => {
      const result = formatCOP(1500)
      expect(result).not.toMatch(/[,.]00/)
    })

    it('includes all significant digits for large numbers', () => {
      const result = formatCOP(5000000)
      expect(result).toContain('5')
      expect(result).toContain('000')
    })
  })

  describe('formatCOPDecimals', () => {
    it('returns a string', () => {
      expect(typeof formatCOPDecimals(1234.56)).toBe('string')
    })

    it('includes the currency symbol', () => {
      expect(formatCOPDecimals(1000)).toContain('$')
    })

    it('includes decimal digits', () => {
      const result = formatCOPDecimals(1234.56)
      expect(result).toContain('56')
    })

    it('formats zero with two decimal places', () => {
      const result = formatCOPDecimals(0)
      expect(result).toMatch(/00/)
    })

    it('rounds to exactly two decimal places', () => {
      const result = formatCOPDecimals(1.999)
      expect(result).toContain('2')
    })
  })
})
