import { Link, useLocation } from 'wouter';
import { LayoutDashboard, BarChart3, Users, MapPin, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Couriers', path: '/couriers', icon: Users },
    { name: 'Tracking', path: '/tracking', icon: MapPin },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1" data-testid="link-logo">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">DeliveryOps</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover-elevate ${
                      active
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground'
                    }`}
                    data-testid={`link-${item.name.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <div className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-error text-white">
                  3
                </Badge>
              </div>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" x2="12" y1="22.08" y2="12" />
    </svg>
  );
}
