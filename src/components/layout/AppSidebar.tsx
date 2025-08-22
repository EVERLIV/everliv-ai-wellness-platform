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
      className="w-64 border-r border-border/60 bg-white/95 backdrop-blur-sm"
      collapsible="icon"
    >
      {/* Отступ от хедера */}
      <div className="h-14"></div>

      {/* Компактная кнопка скрытия */}
      <div className="flex justify-end px-3 pb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-7 w-7 p-0 hover:bg-slate-100 rounded-lg opacity-70 hover:opacity-100 transition-all duration-200"
          title="Скрыть панель"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </Button>
      </div>

      <SidebarContent className="bg-transparent pt-0 px-2">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex} className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 mb-2">
              {!collapsed && group.groupLabel}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                            isActive 
                              ? "bg-blue-50 text-blue-700 border-l-3 border-blue-600 shadow-sm" 
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`
                        }
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                          currentPath === item.url ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                        }`} />
                        {!collapsed && (
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm font-medium">{item.title}</span>
                            {item.badge && (
                              <Badge variant={item.badge === "Новое" ? "destructive" : "secondary"} className="text-xs px-2 py-0.5">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                        {/* Активная полоска */}
                        {currentPath === item.url && !collapsed && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        
        {/* Полезная информация внизу */}
        {!collapsed && (
          <div className="mt-auto mb-4 mx-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="text-sm font-medium text-blue-900 mb-1">Совет дня</div>
            <div className="text-xs text-blue-700 leading-relaxed">
              Регулярно отслеживайте показатели здоровья для лучших результатов
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}