import { formatShortNumber } from '@/src/lib/utils';
import { Order } from '@/src/features/order/types';
import dayjs from 'dayjs';
import ReactApexChart from 'react-apexcharts';

interface Props {
  orderList: Order[];
  range: string;
}

function buildRevenueData(orderList: Order[], range: string) {
  const now = dayjs();

  const monthCountMap: Record<string, number> = {
    '1M': 1,
    '3M': 3,
    '6M': 6,
    '1Y': 12,
  };

  const monthsToShow = monthCountMap[range] || 6;

  const filteredOrders = orderList.filter(o => !o.returned && dayjs(o.date).isAfter(now.subtract(monthsToShow, 'month')));

  const revenueMap: Record<string, number> = {};

  filteredOrders.forEach(o => {
    const key = dayjs(o.date).format('MMM');
    revenueMap[key] = (revenueMap[key] || 0) + o.total;
  });

  const categories: string[] = [];
  const data: number[] = [];

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const m = now.subtract(i, 'month').format('MMM');
    categories.push(m);
    data.push(revenueMap[m] || 0);
  }

  return { categories, data };
}

export default function ColumnChart({ orderList, range }: Props) {
  const { categories, data } = buildRevenueData(orderList, range);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: 'rgba(255,255,255,0.3)',
          fontSize: '10px',
        },
      },
    },
    yaxis: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: ['#6366F1'],
        stops: [0, 100],
      },
    },
    colors: ['#8B5CF6'],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: val => `${formatShortNumber(val)}`,
      },
    },
  };

  const series = [
    {
      name: 'Revenue',
      data,
    },
  ];

  return <ReactApexChart options={options} series={series} type="bar" height={250} />;
}
