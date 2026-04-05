<template>
  <div class="rounded-xl bg-autoSlate p-4 border border-autoSteel">
    <h2 class="text-lg font-semibold text-white mb-3">Top 10 Products by Sales Revenue</h2>
    <div class="h-[420px]">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Chart } from "chart.js/auto";

const props = defineProps({
  labels: {
    type: Array,
    required: true
  },
  values: {
    type: Array,
    required: true
  }
});

const chartRef = ref(null);
let chartInstance;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const chartTextColor = "#CBD5E1";
const axisColor = "#475569";

function renderChart() {
  if (!chartRef.value) {
    return;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartRef.value, {
    type: "bar",
    data: {
      labels: props.labels,
      datasets: [
        {
          label: "Revenue (USD)",
          data: props.values,
          backgroundColor: "rgba(249, 115, 22, 0.8)",
          borderColor: "rgba(245, 158, 11, 1)",
          borderWidth: 1.5,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      animations: {
        y: {
          duration: 12000,
          easing: "easeOutQuart",
          delay: (ctx) => ctx.dataIndex * 300
        },
        x: {
          duration: 12000,
          easing: "easeOutCubic"
        }
      },
      transitions: {
        active: {
          animation: {
            duration: 1000
          }
        },
        show: {
          animations: {
            y: {
              from: 0
            }
          }
        },
        hide: {
          animations: {
            y: {
              to: 0
            }
          }
        }
      },
      plugins: {
        legend: { labels: { color: chartTextColor } },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${currency.format(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: chartTextColor },
          grid: { color: axisColor }
        },
        y: {
          ticks: {
            color: chartTextColor,
            callback: (value) => currency.format(value)
          },
          grid: { color: axisColor }
        }
      }
    }
  });
}

watch(() => [props.labels, props.values], renderChart, { deep: true });
onMounted(renderChart);
onBeforeUnmount(() => chartInstance && chartInstance.destroy());
</script>
