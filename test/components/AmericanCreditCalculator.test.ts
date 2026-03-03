import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AmericanCreditCalculator from "../../src/components/AmericanCreditCalculator.vue";

// Helpers to locate specific inputs
function amountInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('input[placeholder="Ej: 5.000.000"]');
}
function installmentsInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('input[placeholder="Ej: 24"]');
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

// Fill all three required fields
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

describe("AmericanCreditCalculator", () => {
  describe("initial state", () => {
    it("renders the calculate button", () => {
      const wrapper = mount(AmericanCreditCalculator);
      expect(calculateButton(wrapper).text()).toBe("Calcular");
    });

    it("defaults to monthly rate (TEM) mode", () => {
      const wrapper = mount(AmericanCreditCalculator);
      expect((rateTypeSelect(wrapper).element as HTMLSelectElement).value).toBe(
        "monthly",
      );
    });

    it("does not show results initially", () => {
      const wrapper = mount(AmericanCreditCalculator);
      expect(wrapper.text()).not.toContain("Resultados");
    });

    it("does not show an error initially", () => {
      const wrapper = mount(AmericanCreditCalculator);
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    });
  });

  describe("rate type toggle", () => {
    it("switches to annual (TEA) when selected", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      expect((rateTypeSelect(wrapper).element as HTMLSelectElement).value).toBe(
        "annual",
      );
    });

    it("clears results when the rate type changes", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
      await rateTypeSelect(wrapper).setValue("annual");
      expect(wrapper.text()).not.toContain("Resultados");
    });
  });

  describe("validation", () => {
    it("shows an error when all required fields are empty", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("obligatorios");
    });

    it("shows an error when amount is missing", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await installmentsInput(wrapper).setValue("12");
      await rateInput(wrapper).setValue("1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    it("shows a Zod error for a zero or negative amount", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "0", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("monto");
    });

    it("shows a Zod error for fractional installments", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "1.5", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("cuotas");
    });

    it("shows an error when rate is 0 (American system requires r > 0)", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("tasa");
    });
  });

  describe("calculation with monthly rate (TEM)", () => {
    it("shows results when required fields are filled", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
    });

    it("shows the periodic interest payment stat", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Cuota periódica (interés)");
    });

    it("shows the last installment stat", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Última cuota");
    });

    it("shows the amortization table with the correct number of rows", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      const rows = wrapper.findAll("tbody tr");
      expect(rows).toHaveLength(12);
    });

    it("shows the bullet badge on the last row", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      const rows = wrapper.findAll("tbody tr");
      expect(rows[rows.length - 1].text()).toContain("Final");
    });

    it("does not show the bullet badge on non-last rows", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      const rows = wrapper.findAll("tbody tr");
      expect(rows[0].text()).not.toContain("bullet");
    });

    it("calculates TNA as 12x the monthly rate", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      // 1.5% monthly → TNA = 18.00%
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("18.00%");
      expect(wrapper.text()).toContain("Tasa nominal anual");
    });

    it("shows the total interest stat", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Interés total");
    });
  });

  describe("calculation with annual rate (TEA)", () => {
    it("shows results when TEA is selected", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      await fillRequired(wrapper, "1200000", "12", "19.5618");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
    });

    it("converts TEA to TEM and shows correct TNA", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      // TEA = (1.015^12 - 1)*100 ≈ 19.5618% → TEM ≈ 1.5% → TNA = 18.00%
      await fillRequired(wrapper, "1200000", "12", "19.5618");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("18.00%");
      expect(wrapper.text()).toContain("Tasa nominal anual");
    });
  });

  describe("clear results", () => {
    it("clears results when an input changes after calculation", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
      await amountInput(wrapper).trigger("input");
      expect(wrapper.text()).not.toContain("Resultados");
    });

    it("clears the error message when an input changes", async () => {
      const wrapper = mount(AmericanCreditCalculator);
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      await amountInput(wrapper).trigger("input");
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    });
  });
});
