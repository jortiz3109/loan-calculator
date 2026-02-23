/// <reference path="../../src/types.d.ts" />
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AmortizationTable from '../../src/components/AmortizationTable.vue'

// Build a simple schedule: n months at 0% interest, equal capital payments
function buildSchedule(amount: number, months: number, adminFees = 0): AmortizationRow[] {
  const capitalPayment = amount / months
  const installmentAmount = capitalPayment + adminFees
  const schedule: AmortizationRow[] = []
  let balance = amount

  for (let i = 1; i <= months; i++) {
    const startBalance = balance
    const endBalance = i === months ? 0 : balance - capitalPayment
    schedule.push({
      month: i,
      startBalance,
      interestPayment: 0,
      capitalPayment,
      adminFees,
      totalPayment: installmentAmount,
      endBalance,
    })
    balance = endBalance
  }
  return schedule
}

describe('AmortizationTable', () => {
  describe('basic rendering', () => {
    it('renders the table header', () => {
      const schedule = buildSchedule(1200000, 6)
      const wrapper = mount(AmortizationTable, {
        props: { schedule, totalPaid: 1200000, showAdminFees: false },
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
      const schedule = buildSchedule(1200000, months)
      const wrapper = mount(AmortizationTable, {
        props: { schedule, totalPaid: 1200000, showAdminFees: false },
      })
      const rows = wrapper.findAll('tbody tr')
      expect(rows).toHaveLength(months)
    })

    it('renders month numbers in order', () => {
      const schedule = buildSchedule(600000, 3)
      const wrapper = mount(AmortizationTable, {
        props: { schedule, totalPaid: 600000, showAdminFees: false },
      })
      const rows = wrapper.findAll('tbody tr')
      expect(rows[0].text()).toContain('1')
      expect(rows[1].text()).toContain('2')
      expect(rows[2].text()).toContain('3')
    })

    it('renders a footer with totals', () => {
      const schedule = buildSchedule(1200000, 6)
      const wrapper = mount(AmortizationTable, {
        props: { schedule, totalPaid: 1200000, showAdminFees: false },
      })
      expect(wrapper.find('tfoot').text()).toContain('Total')
    })
  })

  describe('admin fees column', () => {
    it('hides the admin fees column when showAdminFees is false', () => {
      const schedule = buildSchedule(1200000, 3)
      const wrapper = mount(AmortizationTable, {
        props: { schedule, totalPaid: 1200000, showAdminFees: false },
      })
      expect(wrapper.text()).not.toContain('Gastos admin.')
    })

    it('shows the admin fees column when showAdminFees is true', () => {
      const schedule = buildSchedule(1200000, 3, 50000)
      const wrapper = mount(AmortizationTable, {
        props: { schedule, totalPaid: 1200000 + 3 * 50000, showAdminFees: true },
      })
      expect(wrapper.text()).toContain('Gastos admin.')
    })

    it('shows admin fees column in the footer when showAdminFees is true', () => {
      const schedule = buildSchedule(600000, 2, 10000)
      const wrapper = mount(AmortizationTable, {
        props: { schedule, totalPaid: 620000, showAdminFees: true },
      })
      const footer = wrapper.find('tfoot')
      expect(footer.findAll('td').length).toBeGreaterThan(
        mount(AmortizationTable, {
          props: { schedule, totalPaid: 600000, showAdminFees: false },
        }).find('tfoot').findAll('td').length,
      )
    })
  })
})
