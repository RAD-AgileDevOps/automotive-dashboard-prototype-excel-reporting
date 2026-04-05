<template>
  <div class="rounded-xl bg-autoSlate p-4 border border-autoSteel">
    <h2 class="text-lg font-semibold text-white mb-3">Top 10 Products by Product Count</h2>
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
    type: "line",
    data: {
      labels: props.labels,
      datasets: [
        {
          label: "Product Count",
          data: props.values,
          borderColor: "rgba(14, 165, 233, 1)",
          backgroundColor: "rgba(14, 165, 233, 0.25)",
          fill: true,
          tension: 0.35,
          pointBackgroundColor: "rgba(56, 189, 248, 1)",
          pointRadius: 4
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
        tension: {
          duration: 12000,
          easing: "easeOutCubic",
          from: 0.7,
          to: 0.35
        },
        y: {
          duration: 12000,
          easing: "easeOutQuart",
          delay: (ctx) => ctx.dataIndex * 300
        },
        radius: {
          duration: 12000,
          easing: "easeOutBack"
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
        legend: { labels: { color: chartTextColor } }
      },
      scales: {
        x: {
          ticks: { color: chartTextColor },
          grid: { color: axisColor }
        },
        y: {
          ticks: { color: chartTextColor },
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
