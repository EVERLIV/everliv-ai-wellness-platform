import React from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { 
  User, 
  Settings, 
  HeartHandshake, 
  Activity,
  FileText,
  HelpCircle,
  MessageSquare,
  Bell,
  Shield,
  Wrench,
  BarChart3,
  Calendar,
  Pill,
  Brain,
  Stethoscope,
  Heart,
  Utensils,
  TestTube,
  TrendingUp,
  BookOpen,
  ChevronLeft,
  Home,
  Target,
  Zap
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    groupLabel: "Главное",
    items: [
      { title: "Панель управления", url: "/dashboard", icon: Home, badge: null },
      { title: "Мои цели", url: "/goals", icon: Target, badge: "3" },
    ]
  },
  {
    groupLabel: "Анализ и диагностика",
    items: [
      { title: "ИИ Доктор", url: "/ai-doctor", icon: Brain, badge: null },
      { title: "Анализы крови", url: "/lab-analyses", icon: TestTube, badge: "Новое" },
      { title: "Диагностика", url: "/diagnostics", icon: Stethoscope, badge: null },
      { title: "Мои биомаркеры", url: "/my-biomarkers", icon: Activity, badge: null },
    ]
  },
  {
    groupLabel: "Здоровье и отслеживание",
    items: [
      { title: "Профиль здоровья", url: "/health-profile", icon: Heart, badge: null },
      { title: "Аналитика", url: "/analytics", icon: BarChart3, badge: null },
      { title: "Календарь здоровья", url: "/calendar", icon: Calendar, badge: null },
      { title: "Питание", url: "/nutrition", icon: Utensils, badge: null },
    ]
  },
  {
    groupLabel: "Ресурсы",
    items: [
      { title: "Рекомендации", url: "/recommendations", icon: Zap, badge: "5" },
      { title: "База знаний", url: "/medical-knowledge", icon: BookOpen, badge: null },
      { title: "Специалисты", url: "/specialists", icon: HeartHandshake, badge: null },
    ]
  }
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-accent text-accent-foreground font-medium" 
      : "text-muted-foreground hover:bg-neutral-100 hover:text-neutral-700";

  return (
    <Sidebar
      className="border-r border-border bg-surface"
      collapsible="icon"
    >
      {/* Отступ от хедера */}
      <div className="h-14"></div>

      <SidebarContent className="bg-transparent px-4">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-8">
            <SidebarGroupLabel className="text-xs font-semibold text-foreground-light uppercase tracking-wider mb-3">
              {!collapsed && group.groupLabel}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                            isActive 
                              ? "bg-primary-ultra-light text-primary border-l-2 border-primary" 
                              : "text-foreground-medium hover:bg-surface-elevated hover:text-foreground"
                          }`
                        }
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                          currentPath === item.url ? "text-primary" : "text-foreground-light group-hover:text-foreground-medium"
                        }`} />
                        {!collapsed && (
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm font-medium">{item.title}</span>
                            {item.badge && (
                              <Badge 
                                variant={item.badge === "Новое" ? "destructive" : "secondary"} 
                                size="sm"
                                className="text-xs"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        
        {/* Совет дня внизу */}
        {!collapsed && (
          <div className="mt-auto mb-6 p-4 bg-secondary-ultra-light rounded-xl border border-secondary/20">
            <div className="text-sm font-semibold text-secondary-dark mb-2">💡 Совет дня</div>
            <div className="text-xs text-foreground-medium leading-relaxed">
              Регулярно отслеживайте показатели здоровья для лучших результатов
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}