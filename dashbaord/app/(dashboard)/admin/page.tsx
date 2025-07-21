

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb"

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation'
import Header from "@/components/Header";

export default async function AdminPage() {
  const { userId } = await auth();
  
    if (!userId) {
      redirect('/admin');
    }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header / Breadcrumb */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                   <h1 className="text-2xl font-bold text-green-600">PandaConnect</h1>
                  </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                          <span className="ml-4 px-3 py-1 bg-green-600 text-gray-100 text-sm font-medium rounded-full">
                            Admin Dashboard
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                         <Header />
                        </div>
                      </div>
                    </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 flex gap-4 flex-col md:flex-row">
          {/* LEFT: user cards + charts */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            {/* USER CARDS */}
            <div className="flex gap-4 justify-between flex-wrap">
              
            </div>

            {/* MIDDLE CHARTS */}
            <div className="flex gap-4 flex-col lg:flex-row">
              <div className="w-full lg:w-1/3 h-[450px]">
               
              </div>
              <div className="w-full lg:w-2/3 h-[450px]">
                
              </div>
            </div>

            {/* BOTTOM CHART */}
            <div className="w-full h-[500px]">
              
            </div>
          </div>

          {/* RIGHT: calendar + announcements */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
