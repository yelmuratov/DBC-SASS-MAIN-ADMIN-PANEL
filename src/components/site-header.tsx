import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./toggle-mode";

export function SiteHeader() {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
      </div>
      
      {/* Push ModeToggle to the right */}
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
}
