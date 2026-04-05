<template>
  <div class="max-w-7xl mx-auto p-6 lg:p-10">
    <header class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Automotive Business Dashboard</h1>
        <p class="text-sm text-slate-300 mt-1">Top 10 highest sales revenue and product count insights</p>
      </div>
      <button
        class="inline-flex items-center justify-center rounded-lg bg-autoOrange px-4 py-2 text-sm font-semibold text-white shadow hover:bg-autoAmber transition-colors"
        @click="handleExport"
      >
        Export to Excel
      </button>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KpiCard title="Total Revenue" :value="currency.format(totalRevenue)" />
      <KpiCard title="Total Units Sold" :value="numberFmt.format(totalUnits)" />
      <KpiCard title="Top Product" :value="topProduct" />
      <KpiCard title="Avg Revenue / Product" :value="currency.format(avgRevenue)" />
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <RevenueChart :labels="revenueLabels" :values="revenueValues" />
      <CountChart :labels="countLabels" :values="countValues" />
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { exportTopProductsToExcel } from "~/utils/exportToExcel";

const { data } = await useFetch("/api/dashboard");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const numberFmt = new Intl.NumberFormat("en-US");

const revenueTop10 = computed(() => data.value?.revenueTop10 ?? []);
const countTop10 = computed(() => data.value?.countTop10 ?? []);

const revenueLabels = computed(() => revenueTop10.value.map((item) => item.product_name));
const revenueValues = computed(() => revenueTop10.value.map((item) => item.sales_revenue));
const countLabels = computed(() => countTop10.value.map((item) => item.product_name));
const countValues = computed(() => countTop10.value.map((item) => item.product_count));

const totalRevenue = computed(() => data.value?.kpis?.totalRevenue ?? 0);
const totalUnits = computed(() => data.value?.kpis?.totalUnits ?? 0);
const topProduct = computed(() => data.value?.kpis?.topProduct ?? "-");
const avgRevenue = computed(() => data.value?.kpis?.avgRevenue ?? 0);

function handleExport() {
  const exportRows = revenueTop10.value.map((item, index) => ({
    Rank: index + 1,
    Product: item.product_name,
    Revenue_USD: item.sales_revenue,
    Product_Count: item.product_count
  }));

  exportTopProductsToExcel(exportRows);
}
</script>
