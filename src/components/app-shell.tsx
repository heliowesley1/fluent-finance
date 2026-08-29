import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Plus, Search, Sun, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems, mobileNavItems } from "@/components/nav-items";
import { QuickAddDialog } from "@/components/quick-add-dialog";
import { GlobalSearch } from "@/components/global-search";
import { useTheme } from "@/lib/theme";
import { useFinance } from "@/lib/finance-store";
import type { TransactionKind } from "@/lib/types";

interface QuickAddApi {
  open: (kind?: TransactionKind) => void;
}
const QuickAddContext = createContext<QuickAddApi>({ open: () => {} });
export const useQuickAdd = () => useContext(QuickAddContext);

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto">
      {navItems.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddKind, setQuickAddKind] = useState<TransactionKind>("despesa");
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { profile } = useFinance();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const bare = pathname === "/login";

  const open = useCallback((kind: TransactionKind = "despesa") => {
    setQuickAddKind(kind);
    setQuickAddOpen(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      if (key === "n") {
        event.preventDefault();
        open("despesa");
      } else if (key === "d") {
        event.preventDefault();
        open("despesa");
      } else if (key === "r") {
        event.preventDefault();
        open("receita");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (bare) return <>{children}</>;

  return (
    <QuickAddContext.Provider value={{ open }}>
      <div className="min-h-screen bg-background">
        {/* Sidebar desktop */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block">
          <div className="flex h-full flex-col p-5">
            <Link to="/" className="mb-7 flex items-center gap-2.5 px-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Wallet className="size-4" />
              </span>
              <span className="text-base font-semibold tracking-tight">Nexus Finance</span>
            </Link>

            <NavLinks />

            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-muted-foreground"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="size-4" />
                Buscar
                <kbd className="ml-auto rounded border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
              </Button>
              <Button className="w-full gap-2" onClick={() => open("despesa")}>
                <Plus className="size-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </aside>

        {/* Topbar mobile */}
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-5">
              <SheetTitle className="mb-6 flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Wallet className="size-4" />
                </span>
                Nexus Finance
              </SheetTitle>
              <NavLinks onNavigate={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>

          <span className="truncate font-semibold tracking-tight">Nexus Finance</span>

          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Buscar">
              <Search className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Alternar tema">
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
          </div>
        </header>

        {/* Topbar desktop */}
        <div className="fixed top-4 right-6 z-20 hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Alternar tema">
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <span className="grid size-9 place-items-center rounded-full bg-muted text-sm font-semibold">
            {profile.name.slice(0, 1)}
          </span>
        </div>

        <main className="pb-24 lg:pb-10 lg:pl-64">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-8 lg:p-10">{children}</div>
        </main>

        {/* Bottom nav mobile */}
        <nav className="fixed right-0 bottom-0 left-0 z-30 flex border-t bg-background/95 p-2 backdrop-blur lg:hidden">
          {mobileNavItems.slice(0, 2).map((item) => (
            <BottomLink key={item.to} item={item} active={pathname === item.to} />
          ))}
          <div className="flex flex-1 flex-col items-center">
            <button
              onClick={() => open("despesa")}
              aria-label="Adicionar lançamento"
              className="-mt-7 grid size-13 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-95"
            >
              <Plus className="size-6" />
            </button>
          </div>
          {mobileNavItems.slice(2).map((item) => (
            <BottomLink key={item.to} item={item} active={pathname === item.to} />
          ))}
        </nav>

        <QuickAddDialog
          open={quickAddOpen}
          onOpenChange={setQuickAddOpen}
          initialKind={quickAddKind}
        />
        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </QuickAddContext.Provider>
  );
}

function BottomLink({
  item,
  active,
}: {
  item: (typeof mobileNavItems)[number];
  active: boolean;
}) {
  return (
    <Link
      to={item.to}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-1 transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <item.icon className="size-5" />
      <span className="text-[10px] font-medium">{item.label}</span>
    </Link>
  );
}
