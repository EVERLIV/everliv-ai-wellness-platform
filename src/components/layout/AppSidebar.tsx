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
  BookOpen
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
} from "@/components/ui/sidebar";

const menuItems = [
  {
    groupLabel: "Инструменты",
    items: [
      { title: "ИИ Доктор", url: "/ai-doctor", icon: Brain },
      { title: "Профиль здоровья", url: "/health-profile", icon: Heart },
      { title: "Аналитика", url: "/analytics", icon: BarChart3 },
      { title: "Дневник питания", url: "/nutrition-diary", icon: Utensils },
      { title: "Лабораторные анализы", url: "/lab-analyses", icon: TestTube },
      { title: "Мои биомаркеры", url: "/my-biomarkers", icon: Activity },
      { title: "Рекомендации", url: "/my-recommendations", icon: HeartHandshake },
      { title: "Биологический возраст", url: "/biological-age", icon: TrendingUp },
      { title: "База знаний", url: "/knowledge-base", icon: BookOpen },
      { title: "Календарь здоровья", url: "/health-calendar", icon: Calendar },
    ]
  },
  {
    groupLabel: "Поддержка",
    items: [
      { title: "Центр помощи", url: "/help", icon: HelpCircle },
      { title: "Чат с командой", url: "/support-chat", icon: MessageSquare },
      { title: "Уведомления", url: "/notifications", icon: Bell },
      { title: "Конфиденциальность", url: "/privacy", icon: Shield },
    ]
  },
  {
    groupLabel: "Настройки",
    items: [
      { title: "Настройки профиля", url: "/settings", icon: Settings },
      { title: "Инструменты разработчика", url: "/dev-tools", icon: Wrench },
      { title: "Медицинские услуги", url: "/medical-services", icon: Stethoscope },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-background pt-14">
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
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
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