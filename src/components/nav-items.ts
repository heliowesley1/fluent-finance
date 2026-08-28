import {
  CreditCard,
  Gem,
  Goal,
  LayoutDashboard,
  Landmark,
  LineChart,
  PieChart,
  Receipt,
  Repeat,
  Settings,
  TrendingDown,
  Wallet,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Lançamentos", to: "/lancamentos", icon: Receipt },
  { label: "Contas", to: "/contas", icon: Landmark },
  { label: "Cartões", to: "/cartoes", icon: CreditCard },
  { label: "Orçamentos", to: "/orcamentos", icon: PieChart },
  { label: "Metas", to: "/metas", icon: Goal },
  { label: "Investimentos", to: "/investimentos", icon: LineChart },
  { label: "Dívidas", to: "/dividas", icon: TrendingDown },
  { label: "Assinaturas", to: "/assinaturas", icon: Repeat },
  { label: "Relatórios", to: "/relatorios", icon: Wallet },
  { label: "Patrimônio", to: "/patrimonio", icon: Gem },
  { label: "Configurações", to: "/configuracoes", icon: Settings },
];

export const mobileNavItems: NavItem[] = [
  { label: "Início", to: "/", icon: LayoutDashboard },
  { label: "Lanç.", to: "/lancamentos", icon: Receipt },
  { label: "Cartões", to: "/cartoes", icon: CreditCard },
  { label: "Metas", to: "/metas", icon: Goal },
];
