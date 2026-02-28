/// <reference path="../../src/types.d.ts" />
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AmericanAmortizationTable from '../../src/components/AmericanAmortizationTable.vue'

// Build an American amortization schedule: interest-only payments, bullet capital at end
function buildAmericanSchedule(
  amount: number,
  months: number,
  r = 0.015,
): AmortizationRow[] {
  const interestPayment = Math.round(amount * r)
  const schedule: AmortizationRow[] = []

  for (let i = 1; i <= months; i++) {
    const isLast = i === months
    schedule.push({
      month: i,
      startBalance: amount,
      interestPayment,
      capitalPayment: isLast ? amount : 0,
      adminFees: 0,
      totalPayment: isLast ? interestPayment + amount : interestPayment,
      endBalance: isLast ? 0 : amount,
    })
  }
  return schedule
}

describe('AmericanAmortizationTable', () => {
  describe('basic rendering', () => {
    it('renders the table header', () => {
      const schedule = buildAmericanSchedule(1200000, 6)
      const wrapper = mount(AmericanAmortizationTable, {
        props: { schedule, totalPaid: 6 * 18000 + 1200000 },
      })
      expect(wrapper.text()).toContain('Tabla de amortización')
      expect(wrapper.text()).toContain('Mes')
      expect(wrapper.text()).toContain('Saldo inicial')
      expect(wrapper.text()).toContain('Intereses')
      expect(wrapper.text()).toContain('Abono capital')
      expect(wrapper.text()).toContain('Saldo final')
    })

    it('renders the correct number of data rows', () => {
      const months = 6
      const schedule = buildAmericanSchedule(1200000, months)
      const wrapper = mount(AmericanAmortizationTable, {
        props: { schedule, totalPaid: 1200000 + months * 18000 },
      })
      expect(wrapper.findAll('tbody tr')).toHaveLength(months)
    })

    it('renders month numbers in order', () => {
      const schedule = buildAmericanSchedule(600000, 3)
      const wrapper = mount(AmericanAmortizationTable, {
        props: { schedule, totalPaid: 600000 + 3 * Math.round(600000 * 0.015) },
      })
      const rows = wrapper.findAll('tbody tr')
      expect(rows[0].text()).toContain('1')
      expect(rows[1].text()).toContain('2')
      expect(rows[2].text()).toContain('3')
    })

    it('renders a footer row with totals', () => {
      const schedule = buildAmericanSchedule(1200000, 6)
      const wrapper = mount(AmericanAmortizationTable, {
        props: { schedule, totalPaid: 1200000 + 6 * 18000 },
      })
      expect(wrapper.find('tfoot').text()).toContain('Total')
    })

    it('does not render the admin fees column', () => {
      const schedule = buildAmericanSchedule(1200000, 6)
      const wrapper = mount(AmericanAmortizationTable, {
        props: { schedule, totalPaid: 1200000 + 6 * 18000 },
      })
      expect(wrapper.text()).not.toContain('Gastos admin.')
    })
  })

  describe('american schedule structure', () => {
    it('shows the bullet badge only on the last row', () => {
      const schedule = buildAmericanSchedule(1200000, 4)
      const wrapper = mount(AmericanAmortizationTable, {
        props: { schedule, totalPaid: 1200000 + 4 * 18000 },
      })
      const rows = wrapper.findAll('tbody tr')
      expect(rows[rows.length - 1].text()).toContain('bullet')
      for (let i = 0; i < rows.length - 1; i++) {
        expect(rows[i].text()).not.toContain('bullet')
      }
    })

    it('last row has a higher total payment than the periodic rows', () => {
      const amount = 1200000
      const r = 0.015
      const interestPayment = Math.round(amount * r)
      const schedule = buildAmericanSchedule(amount, 4, r)

      // Non-last rows have totalPayment = interestPayment
      expect(schedule[0].totalPayment).toBe(interestPayment)
      // Last row has totalPayment = interestPayment + amount
      expect(schedule[3].totalPayment).toBe(interestPayment + amount)
      expect(schedule[3].totalPayment).toBeGreaterThan(
        schedule[0].totalPayment,
      )
    })

    it('all non-last rows have zero capital payment', () => {
      const schedule = buildAmericanSchedule(1200000, 6)
      for (let i = 0; i < schedule.length - 1; i++) {
        expect(schedule[i].capitalPayment).toBe(0)
      }
    })

    it('last row has capital payment equal to the full principal', () => {
      const amount = 1200000
      const schedule = buildAmericanSchedule(amount, 6)
      expect(schedule[schedule.length - 1].capitalPayment).toBe(amount)
    })

    it('all rows have the same start balance (principal stays constant)', () => {
      const amount = 1200000
      const schedule = buildAmericanSchedule(amount, 6)
      for (const row of schedule) {
        expect(row.startBalance).toBe(amount)
      }
    })

    it('all rows have the same interest payment (constant interest)', () => {
      const amount = 1200000
      const r = 0.015
      const expectedInterest = Math.round(amount * r)
      const schedule = buildAmericanSchedule(amount, 6, r)
      for (const row of schedule) {
        expect(row.interestPayment).toBe(expectedInterest)
      }
    })

    it('all non-last rows have end balance equal to the principal', () => {
      const amount = 1200000
      const schedule = buildAmericanSchedule(amount, 6)
      for (let i = 0; i < schedule.length - 1; i++) {
        expect(schedule[i].endBalance).toBe(amount)
      }
    })

    it('last row has end balance of zero', () => {
      const schedule = buildAmericanSchedule(1200000, 6)
      expect(schedule[schedule.length - 1].endBalance).toBe(0)
    })
  })
})
