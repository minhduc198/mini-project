"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const UP_DATA = [20, 28, 22, 35, 30, 42, 38, 50, 45, 62];
const DOWN_DATA = [60, 52, 58, 44, 50, 38, 42, 30, 34, 22];

interface LineChartProps {
  color: string;
  up?: boolean;
  data?: number[];
  width?: number;
  height?: number;
}

export default function LineChart({
  color,
  up = true,
  data,
  width = 80,
  height = 40,
}: LineChartProps) {
  const seriesData = data ?? (up ? UP_DATA : DOWN_DATA);

  const options: ApexOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    stroke: {
      curve: "smooth",
      width: 2,
    },

    colors: [color],

    tooltip: {
      enabled: false,
    },

    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        opacityFrom: 0.2,
        opacityTo: 0.0,
        stops: [0, 100],
      },
    },

    grid: { show: false },
    xaxis: {
      labels: { show: false },
    },
    yaxis: { show: false },
  };

  const series = [{ name: "value", data: seriesData }];

  return (
    <ReactApexChart
      type="area"
      options={options}
      series={series}
      width={width}
      height={height}
    />
  );
}
