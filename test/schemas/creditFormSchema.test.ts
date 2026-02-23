import { describe, it, expect } from 'vitest'
import { creditFormSchema } from '../../src/schemas/creditFormSchema'

describe('creditFormSchema', () => {
  describe('valid inputs', () => {
    it('accepts all fields', () => {
      const result = creditFormSchema.safeParse({
        amount: 5000000,
        installments: 24,
        installmentAmount: 300000,
        rate: 1.5,
      })
      expect(result.success).toBe(true)
    })

    it('accepts input without installmentAmount', () => {
      const result = creditFormSchema.safeParse({
        amount: 5000000,
        installments: 24,
        rate: 1.5,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.installmentAmount).toBeUndefined()
      }
    })

    it('coerces string numbers', () => {
      const result = creditFormSchema.safeParse({
        amount: '5000000',
        installments: '24',
        rate: '1.5',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.amount).toBe(5000000)
        expect(result.data.installments).toBe(24)
        expect(result.data.rate).toBe(1.5)
      }
    })

    it('accepts zero rate', () => {
      const result = creditFormSchema.safeParse({
        amount: 1200000,
        installments: 12,
        rate: 0,
      })
      expect(result.success).toBe(true)
    })

    it('accepts minimum installments of 1', () => {
      const result = creditFormSchema.safeParse({
        amount: 500000,
        installments: 1,
        rate: 2,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('rejects negative amount', () => {
      const result = creditFormSchema.safeParse({
        amount: -1,
        installments: 12,
        rate: 1.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects zero amount', () => {
      const result = creditFormSchema.safeParse({
        amount: 0,
        installments: 12,
        rate: 1.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects fractional installments', () => {
      const result = creditFormSchema.safeParse({
        amount: 1000000,
        installments: 1.5,
        rate: 1.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects zero installments', () => {
      const result = creditFormSchema.safeParse({
        amount: 1000000,
        installments: 0,
        rate: 1.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects negative rate', () => {
      const result = creditFormSchema.safeParse({
        amount: 1000000,
        installments: 12,
        rate: -0.1,
      })
      expect(result.success).toBe(false)
    })

    it('rejects negative installmentAmount', () => {
      const result = creditFormSchema.safeParse({
        amount: 1000000,
        installments: 12,
        installmentAmount: -1,
        rate: 1.5,
      })
      expect(result.success).toBe(false)
    })

    it('rejects zero installmentAmount', () => {
      const result = creditFormSchema.safeParse({
        amount: 1000000,
        installments: 12,
        installmentAmount: 0,
        rate: 1.5,
      })
      expect(result.success).toBe(false)
    })

    it('includes a descriptive error message for invalid amount', () => {
      const result = creditFormSchema.safeParse({
        amount: -1,
        installments: 12,
        rate: 1.5,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('monto')
      }
    })

    it('includes a descriptive error message for invalid installments', () => {
      const result = creditFormSchema.safeParse({
        amount: 1000000,
        installments: 0,
        rate: 1.5,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('cuotas')
      }
    })
  })
})
