"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Image,
  User,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X,
} from "lucide-react";
import { useState } from "react";

export interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  children?: SidebarItem[];
}

export interface SidebarConfig {
  title: string;
  items: SidebarItem[];
}

interface DynamicSidebarProps {
  config: SidebarConfig;
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

const sidebarConfigs: Record<string, SidebarConfig> = {
  admin: {
    title: "Admin Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Course Management",
        href: "/admin/courses",
        icon: BookOpen,
      },
      {
        title: "Enrollment Management",
        href: "/admin/enrollments",
        icon: GraduationCap,
      },
      {
        title: "User Management",
        href: "/admin/user-management",
        icon: Users,
      },
      {
        title: "Carousel Management",
        href: "/admin/carousel",
        icon: Image,
      },
      {
        title: "Profile",
        href: "/admin/profile",
        icon: User,
      },
    ],
  },
  user: {
    title: "Student Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "My Courses",
        href: "/user/courses",
        icon: BookOpen,
      },
      {
        title: "My Profile",
        href: "/user/profile",
        icon: User,
      },
    ],
  },
  instructor: {
    title: "Instructor Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/instructor",
        icon: LayoutDashboard,
      },
      {
        title: "My Courses",
        href: "/instructor/courses",
        icon: BookOpen,
      },
      {
        title: "Profile",
        href: "/instructor/profile",
        icon: User,
      },
    ],
  },
};

export function DynamicSidebar({
  config,
  collapsed = false,
  onToggle,
  isMobile = false,
}: DynamicSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLinkClick = () => {
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const active = isActive(item.href);

    return (
      <div key={item.title} className="space-y-1">
        {hasChildren ? (
          <Button
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 px-3 h-10",
              level > 0 && "ml-4 w-[calc(100%-1rem)]",
              collapsed && !isMobile && "justify-center px-2"
            )}
            onClick={() => toggleExpanded(item.title)}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {(!collapsed || isMobile) && (
              <>
                <span className="truncate">{item.title}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 ml-auto transition-transform",
                    isExpanded && "rotate-90"
                  )}
                />
              </>
            )}
            {item.badge && (!collapsed || isMobile) && (
              <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {item.badge}
              </span>
            )}
          </Button>
        ) : (
          <Button
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 px-3 h-10",
              level > 0 && "ml-4 w-[calc(100%-1rem)]",
              collapsed && !isMobile && "justify-center px-2"
            )}
            asChild
          >
            <Link href={item.href} onClick={handleLinkClick}>
              <Icon className="h-4 w-4 shrink-0" />
              {(!collapsed || isMobile) && (
                <span className="truncate">{item.title}</span>
              )}
              {item.badge && (!collapsed || isMobile) && (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          </Button>
        )}

        {hasChildren && isExpanded && (!collapsed || isMobile) && (
          <div className="space-y-1 ml-2">
            {item.children?.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-muted/10 transition-all duration-300",
        collapsed && !isMobile ? "w-14" : "w-64",
        isMobile && "bg-background shadow-xl"
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        {(!collapsed || isMobile) && (
          <Link href="/" onClick={handleLinkClick}>
            <h2 className="text-lg font-semibold truncate">{config.title}</h2>
          </Link>
        )}
        {onToggle && (
          <Button
            variant="ghost"
            size="sm"
            className={cn("ml-auto p-2", collapsed && !isMobile && "mx-auto")}
            onClick={onToggle}
          >
            {isMobile ? (
              <X className="h-4 w-4" />
            ) : collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {config.items.map((item) => renderSidebarItem(item))}
        </div>
      </ScrollArea>

      {/* Mobile Footer */}
      {isMobile && (
        <div className="border-t p-3">
          <p className="text-xs text-muted-foreground text-center">
            Oddlogy Learning Platform
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to get sidebar config by role (client only)
export const getSidebarConfig = (role: string): SidebarConfig => {
  return sidebarConfigs[role.toLowerCase()] || sidebarConfigs.user;
};

// Client wrapper for DynamicSidebar to be used in server components
import { FC } from "react";
export const SidebarClient: FC<{
  role: string;
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}> = ({ role, collapsed, onToggle, isMobile }) => {
  "use client";
  return (
    <DynamicSidebar
      config={getSidebarConfig(role)}
      collapsed={collapsed}
      onToggle={onToggle}
      isMobile={isMobile}
    />
  );
};