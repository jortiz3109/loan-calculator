import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CreditCalculator from "../../src/components/FrenchCreditCalculator.vue";

// Helpers to locate specific inputs
function amountInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('input[placeholder="Ej: 5.000.000"]');
}
function installmentsInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('input[placeholder="Ej: 24"]');
}
function installmentAmountInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('input[placeholder="Ej: 250.000"]');
}
function rateInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('[data-testid="rate-input"]');
}
function rateTypeSelect(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('[data-testid="rate-type-select"]');
}
function calculateButton(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('[data-testid="calculate-btn"]');
}

// Fill the three required fields (installmentAmount is optional)
async function fillRequired(
  wrapper: ReturnType<typeof mount>,
  amount: string,
  installments: string,
  rate: string,
) {
  await amountInput(wrapper).setValue(amount);
  await installmentsInput(wrapper).setValue(installments);
  await rateInput(wrapper).setValue(rate);
}

describe("CreditCalculator", () => {
  describe("initial state", () => {
    it("renders the calculate button", () => {
      const wrapper = mount(CreditCalculator);
      expect(calculateButton(wrapper).text()).toBe("Calcular");
    });

    it("defaults to monthly rate (TEM) mode", () => {
      const wrapper = mount(CreditCalculator);
      expect(
        (
          wrapper.find('[data-testid="rate-type-select"]')
            .element as HTMLSelectElement
        ).value,
      ).toBe("monthly");
    });

    it("does not show results initially", () => {
      const wrapper = mount(CreditCalculator);
      expect(wrapper.text()).not.toContain("Resultados");
    });

    it("does not show an error initially", () => {
      const wrapper = mount(CreditCalculator);
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    });
  });

  describe("rate type toggle", () => {
    it("switches to annual (TEA) when selected", async () => {
      const wrapper = mount(CreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      expect((rateTypeSelect(wrapper).element as HTMLSelectElement).value).toBe(
        "annual",
      );
    });

    it("clears results when the rate type changes", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
      await rateTypeSelect(wrapper).setValue("annual");
      expect(wrapper.text()).not.toContain("Resultados");
    });
  });

  describe("validation", () => {
    it("shows an error when all required fields are empty", async () => {
      const wrapper = mount(CreditCalculator);
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("obligatorios");
    });

    it("shows an error when amount is missing", async () => {
      const wrapper = mount(CreditCalculator);
      await installmentsInput(wrapper).setValue("12");
      await rateInput(wrapper).setValue("1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    it("shows a Zod error for a negative amount", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "0", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("monto");
    });

    it("shows a Zod error for fractional installments", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "1200000", "1.5", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("cuotas");
    });

    it("shows error when installmentAmount is less than theoretical installment", async () => {
      const wrapper = mount(CreditCalculator);
      // 0% rate, 1200000 over 12 months → theoretical = 100000; providing 50000 < theoretical
      await fillRequired(wrapper, "1200000", "12", "0");
      await installmentAmountInput(wrapper).setValue("50000");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });
  });

  describe("calculation with monthly rate (TEM)", () => {
    it("shows results when required fields are filled", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
    });

    it("shows zero-interest stats correctly (0% TEM)", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Total a pagar");
      expect(wrapper.text()).toContain("Interés total");
      // TEM, TEA and TNA should all be 0.00%
      expect(wrapper.text()).toContain("0.00%");
    });

    it("does not show admin fees column when installmentAmount is omitted", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).not.toContain("Gastos admin.");
    });

    it("shows the amortization table with the correct number of rows", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      const rows = wrapper.findAll("tbody tr");
      expect(rows).toHaveLength(12);
    });

    it("shows correct cost level badge for zero total rate", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Bajo");
    });

    it("calculates TNA as 12x the monthly rate", async () => {
      const wrapper = mount(CreditCalculator);
      // 1.5% monthly → TNA = 18.00%
      await fillRequired(wrapper, "5000000", "24", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("18.00%");
      expect(wrapper.text()).toContain("Tasa nominal anual");
    });
  });

  describe("calculation with annual rate (TEA)", () => {
    it("shows results when TEA is selected", async () => {
      const wrapper = mount(CreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
    });

    it("converts TEA to TEM correctly (0% TEA → 0% TEM)", async () => {
      const wrapper = mount(CreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("0.00%");
    });

    it("converts TEA ≈19.56% to TEM ≈1.50% and shows correct TNA", async () => {
      const wrapper = mount(CreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      // TEA = (1.015^12 - 1)*100 ≈ 19.5618%, which converts back to TEM = 1.5% → TNA = 18.00%
      await fillRequired(wrapper, "5000000", "24", "19.5618");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
      expect(wrapper.text()).toContain("18.00%"); // TNA
      expect(wrapper.text()).toContain("Tasa mensual");
    });
  });

  describe("calculation with installmentAmount", () => {
    it("shows admin fees column when installmentAmount > theoretical", async () => {
      const wrapper = mount(CreditCalculator);
      // 0% rate, 1200000 over 12 months → theoretical = 100000; providing 150000
      await fillRequired(wrapper, "1200000", "12", "0");
      await installmentAmountInput(wrapper).setValue("150000");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Gastos admin.");
    });

    it("does not show admin fees column when installmentAmount equals theoretical", async () => {
      const wrapper = mount(CreditCalculator);
      // 0% rate, 1200000 over 12 months → theoretical = 100000
      await fillRequired(wrapper, "1200000", "12", "0");
      await installmentAmountInput(wrapper).setValue("100000");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).not.toContain("Gastos admin.");
    });
  });

  describe("clear results", () => {
    it("clears results when an input changes after calculation", async () => {
      const wrapper = mount(CreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
      await amountInput(wrapper).trigger("input");
      expect(wrapper.text()).not.toContain("Resultados");
    });

    it("clears the error message when an input changes", async () => {
      const wrapper = mount(CreditCalculator);
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      await amountInput(wrapper).trigger("input");
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    });
  });
});
