import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
  
  export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>🏠 الصفحة الرئيسية</SidebarGroup>
          <SidebarGroup>📁 الملفات</SidebarGroup>
          <SidebarGroup>⚙️ الإعدادات</SidebarGroup>
        </SidebarContent>
        <SidebarFooter>🚀 إصدار 1.0</SidebarFooter>
      </Sidebar>
    )
  }
  