import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatCurrency } from "@/lib/format";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontSize: "12px",
    color: "var(--popover-foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)", marginBottom: 4 },
};

export function CashFlowChart({
  data,
}: {
  data: { label: string; receitas: number; despesas: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="gReceitas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gDespesas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => formatCompact(v)} width={64} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Area
          type="monotone"
          dataKey="receitas"
          name="Receitas"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#gReceitas)"
        />
        <Area
          type="monotone"
          dataKey="despesas"
          name="Despesas"
          stroke="var(--chart-2)"
          strokeWidth={2}
          fill="url(#gDespesas)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryDonut({
  data,
  onSelect,
}: {
  data: { name: string; value: number; color: string }[];
  onSelect?: (name: string) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={2}
          stroke="none"
          onClick={(entry: { name?: string }) => entry?.name && onSelect?.(entry.name)}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} className="cursor-pointer" />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyComparisonChart({
  data,
}: {
  data: { label: string; receitas: number; despesas: number; saldo: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => formatCompact(v)} width={64} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} cursor={{ fill: "var(--muted)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="receitas" name="Receitas" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="despesas" name="Despesas" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="saldo" name="Saldo" fill="var(--chart-8)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EvolutionChart({
  data,
  series,
}: {
  data: Record<string, string | number>[];
  series: { key: string; name: string; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} tickFormatter={(v: number) => formatCompact(v)} width={64} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
