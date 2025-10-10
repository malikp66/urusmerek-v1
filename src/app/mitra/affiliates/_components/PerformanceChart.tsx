'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';

import { PerformancePoint } from '@/app/mitra/affiliates/queries';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useTranslations } from '@/lib/i18n/context';

type Props = {
  data: PerformancePoint[];
  locale: 'id' | 'en';
};

export function PerformanceChart({ data, locale }: Props) {
  const intlLocale = locale === 'en' ? 'en-US' : 'id-ID';
  const tSeries = useTranslations('panels.partner.performanceChart.series');
  const chartConfig = useMemo(
    () =>
      ({
        clicks: {
          label: tSeries('clicks'),
          color: 'hsl(var(--chart-1))',
        },
        referrals: {
          label: tSeries('referrals'),
          color: 'hsl(var(--chart-2))',
        },
      }) satisfies ChartConfig,
    [tSeries]
  );
  const formatted = data.map((item) => ({
    ...item,
    label: new Date(item.date).toLocaleDateString(intlLocale, {
      day: '2-digit',
      month: 'short',
    }),
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="var(--color-clicks)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="referrals"
          stroke="var(--color-referrals)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
