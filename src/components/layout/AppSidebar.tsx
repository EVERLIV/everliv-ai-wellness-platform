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
  ChevronLeft
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

const menuItems = [
  {
    groupLabel: "Инструменты",
    items: [
      { title: "ИИ Доктор", url: "/ai-doctor", icon: Brain },
      { title: "Профиль здоровья", url: "/health-profile", icon: Heart },
      { title: "Аналитика", url: "/analytics", icon: BarChart3 },
      { title: "Лабораторные анализы", url: "/lab-analyses", icon: TestTube },
      { title: "Мои биомаркеры", url: "/my-biomarkers", icon: Activity },
      { title: "Биологический возраст", url: "/biological-age", icon: TrendingUp },
      { title: "База знаний", url: "/knowledge-base", icon: BookOpen },
      { title: "Календарь здоровья", url: "/health-calendar", icon: Calendar },
    ]
  },
  {
    groupLabel: "Поддержка",
    items: [
      { title: "Центр помощи", url: "/help", icon: HelpCircle },
      { title: "Уведомления", url: "/notifications", icon: Bell },
      { title: "Конфиденциальность", url: "/privacy", icon: Shield },
    ]
  },
  {
    groupLabel: "Настройки",
    items: [
      { title: "Настройки профиля", url: "/settings", icon: Settings },
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
      className="w-56 border-r border-border bg-card"
      collapsible="icon"
    >
      {/* Отступ от хедера */}
      <div className="h-14"></div>

      {/* Компактная кнопка скрытия */}
      <div className="flex justify-end px-2 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full opacity-60 hover:opacity-100 transition-opacity"
          title="Скрыть панель"
        >
          <ChevronLeft className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>

      <SidebarContent className="bg-card pt-0">
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
              {!collapsed && group.groupLabel}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        {!collapsed && <span className="text-sm text-muted-foreground">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}