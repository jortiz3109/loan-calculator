/// <reference path="../../src/types.d.ts" />
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GermanAmortizationTable from "../../src/components/GermanAmortizationTable.vue";

// Build a German amortization schedule: fixed capital payment, decreasing interest
function buildGermanSchedule(
  amount: number,
  months: number,
  r = 0.015,
): AmortizationRow[] {
  const capitalPayment = Math.round(amount / months);
  const schedule: AmortizationRow[] = [];
  let balance = amount;

  for (let i = 1; i <= months; i++) {
    const startBalance = balance;
    const interestPayment = Math.round(startBalance * r);
    const capital = i === months ? startBalance : capitalPayment;
    const totalPayment = capital + interestPayment;
    const endBalance = Math.max(0, startBalance - capital);

    schedule.push({
      month: i,
      startBalance,
      interestPayment,
      capitalPayment: capital,
      adminFees: 0,
      totalPayment,
      endBalance,
    });
    balance = endBalance;
  }
  return schedule;
}

describe("GermanAmortizationTable", () => {
  describe("basic rendering", () => {
    it("renders the table header", () => {
      const schedule = buildGermanSchedule(1200000, 6);
      const totalPaid = schedule.reduce((s, r) => s + r.totalPayment, 0);
      const wrapper = mount(GermanAmortizationTable, {
        props: { schedule, totalPaid },
      });
      expect(wrapper.text()).toContain("Tabla de amortización");
      expect(wrapper.text()).toContain("Mes");
      expect(wrapper.text()).toContain("Saldo inicial");
      expect(wrapper.text()).toContain("Intereses");
      expect(wrapper.text()).toContain("Abono capital");
      expect(wrapper.text()).toContain("Saldo final");
    });

    it("renders the correct number of data rows", () => {
      const months = 6;
      const schedule = buildGermanSchedule(1200000, months);
      const totalPaid = schedule.reduce((s, r) => s + r.totalPayment, 0);
      const wrapper = mount(GermanAmortizationTable, {
        props: { schedule, totalPaid },
      });
      expect(wrapper.findAll("tbody tr")).toHaveLength(months);
    });

    it("renders month numbers in order", () => {
      const schedule = buildGermanSchedule(600000, 3);
      const totalPaid = schedule.reduce((s, r) => s + r.totalPayment, 0);
      const wrapper = mount(GermanAmortizationTable, {
        props: { schedule, totalPaid },
      });
      const rows = wrapper.findAll("tbody tr");
      expect(rows[0].text()).toContain("1");
      expect(rows[1].text()).toContain("2");
      expect(rows[2].text()).toContain("3");
    });

    it("renders a footer row with totals", () => {
      const schedule = buildGermanSchedule(1200000, 6);
      const totalPaid = schedule.reduce((s, r) => s + r.totalPayment, 0);
      const wrapper = mount(GermanAmortizationTable, {
        props: { schedule, totalPaid },
      });
      expect(wrapper.find("tfoot").text()).toContain("Total");
    });

    it("does not render the admin fees column", () => {
      const schedule = buildGermanSchedule(1200000, 6);
      const totalPaid = schedule.reduce((s, r) => s + r.totalPayment, 0);
      const wrapper = mount(GermanAmortizationTable, {
        props: { schedule, totalPaid },
      });
      expect(wrapper.text()).not.toContain("Gastos admin.");
    });
  });

  describe("german schedule structure", () => {
    it("all rows have the same capital payment (except the last)", () => {
      const amount = 1200000;
      const months = 12;
      const schedule = buildGermanSchedule(amount, months);
      const expectedCapital = Math.round(amount / months);
      for (let i = 0; i < schedule.length - 1; i++) {
        expect(schedule[i].capitalPayment).toBe(expectedCapital);
      }
    });

    it("last row capital payment clears the remaining balance", () => {
      const amount = 1200000;
      const months = 12;
      const schedule = buildGermanSchedule(amount, months);
      // After the last row, end balance must be zero
      expect(schedule[schedule.length - 1].endBalance).toBe(0);
    });

    it("interest payments decrease each period", () => {
      const schedule = buildGermanSchedule(1200000, 6);
      for (let i = 1; i < schedule.length; i++) {
        expect(schedule[i].interestPayment).toBeLessThanOrEqual(
          schedule[i - 1].interestPayment,
        );
      }
    });

    it("total payments decrease each period", () => {
      const schedule = buildGermanSchedule(1200000, 6);
      for (let i = 1; i < schedule.length; i++) {
        expect(schedule[i].totalPayment).toBeLessThanOrEqual(
          schedule[i - 1].totalPayment,
        );
      }
    });

    it("start balance decreases by the capital payment each period", () => {
      const amount = 1200000;
      const months = 6;
      const schedule = buildGermanSchedule(amount, months);
      const capitalPayment = Math.round(amount / months);
      for (let i = 1; i < schedule.length - 1; i++) {
        expect(schedule[i].startBalance).toBe(
          schedule[i - 1].startBalance - capitalPayment,
        );
      }
    });

    it("sum of capital payments equals the loan amount", () => {
      const amount = 1200000;
      const schedule = buildGermanSchedule(amount, 12);
      const totalCapital = schedule.reduce((s, r) => s + r.capitalPayment, 0);
      expect(totalCapital).toBe(amount);
    });

    it("at 0% rate all total payments equal the capital payment", () => {
      const amount = 1200000;
      const months = 12;
      const schedule = buildGermanSchedule(amount, months, 0);
      const capitalPayment = Math.round(amount / months);
      for (const row of schedule) {
        expect(row.interestPayment).toBe(0);
        expect(row.totalPayment).toBe(row.capitalPayment);
      }
      // Capital payments sum to the full amount
      const totalCapital = schedule.reduce((s, r) => s + r.capitalPayment, 0);
      expect(totalCapital).toBe(amount);
    });
  });
});
