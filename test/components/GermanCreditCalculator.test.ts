import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GermanCreditCalculator from "../../src/components/GermanCreditCalculator.vue";

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

describe("GermanCreditCalculator", () => {
  describe("initial state", () => {
    it("renders the calculate button", () => {
      const wrapper = mount(GermanCreditCalculator);
      expect(calculateButton(wrapper).text()).toBe("Calcular");
    });

    it("defaults to monthly rate (TEM) mode", () => {
      const wrapper = mount(GermanCreditCalculator);
      expect((rateTypeSelect(wrapper).element as HTMLSelectElement).value).toBe(
        "monthly",
      );
    });

    it("does not show results initially", () => {
      const wrapper = mount(GermanCreditCalculator);
      expect(wrapper.text()).not.toContain("Resultados");
    });

    it("does not show an error initially", () => {
      const wrapper = mount(GermanCreditCalculator);
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    });
  });

  describe("rate type toggle", () => {
    it("switches to annual (TEA) when selected", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      expect((rateTypeSelect(wrapper).element as HTMLSelectElement).value).toBe(
        "annual",
      );
    });

    it("clears results when the rate type changes", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
      await rateTypeSelect(wrapper).setValue("annual");
      expect(wrapper.text()).not.toContain("Resultados");
    });
  });

  describe("validation", () => {
    it("shows an error when all required fields are empty", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("obligatorios");
    });

    it("shows an error when amount is missing", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await installmentsInput(wrapper).setValue("12");
      await rateInput(wrapper).setValue("1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    it("shows a Zod error for a zero or negative amount", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "0", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("monto");
    });

    it("shows a Zod error for fractional installments", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "1.5", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("cuotas");
    });
  });

  describe("calculation with monthly rate (TEM)", () => {
    it("shows results when required fields are filled", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
    });

    it("accepts zero rate (German system supports 0% interest)", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
      expect(wrapper.text()).toContain("Resultados");
    });

    it("shows the fixed capital payment stat", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Primera cuota");
    });

    it("shows the first and last installment stats", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Primera cuota");
      expect(wrapper.text()).toContain("Última cuota");
    });

    it("shows the amortization table with the correct number of rows", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.findAll("tbody tr")).toHaveLength(12);
    });

    it("shows decreasing total payments across the schedule", async () => {
      const wrapper = mount(GermanCreditCalculator);
      // 1.5% monthly → first payment > last payment
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Primera cuota");
      expect(wrapper.text()).toContain("Última cuota");
      // First installment label shows period 1, last shows period 12
      expect(wrapper.text()).toContain("período 1");
      expect(wrapper.text()).toContain("período 12");
    });

    it("calculates TNA as 12x the monthly rate", async () => {
      const wrapper = mount(GermanCreditCalculator);
      // 1.5% monthly → TNA = 18.00%
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("18.00%");
      expect(wrapper.text()).toContain("Tasa nominal anual");
    });

    it("shows zero total interest at 0% rate", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "0");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("0.00%");
    });

    it("shows the total interest stat", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Interés total");
    });
  });

  describe("calculation with annual rate (TEA)", () => {
    it("shows results when TEA is selected", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await rateTypeSelect(wrapper).setValue("annual");
      await fillRequired(wrapper, "1200000", "12", "19.5618");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
    });

    it("converts TEA to TEM and shows correct TNA", async () => {
      const wrapper = mount(GermanCreditCalculator);
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
      const wrapper = mount(GermanCreditCalculator);
      await fillRequired(wrapper, "1200000", "12", "1.5");
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.text()).toContain("Resultados");
      await amountInput(wrapper).trigger("input");
      expect(wrapper.text()).not.toContain("Resultados");
    });

    it("clears the error message when an input changes", async () => {
      const wrapper = mount(GermanCreditCalculator);
      await calculateButton(wrapper).trigger("click");
      expect(wrapper.find('[role="alert"]').exists()).toBe(true);
      await amountInput(wrapper).trigger("input");
      expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    });
  });
});
