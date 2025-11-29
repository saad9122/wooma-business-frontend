import { Sidebar } from "@/components/Sidebar";
import { PropertiesTable } from "@/components/properties/PropertiesTable";

export default function PropertiesPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <main className="flex-1 bg-background px-10 py-8">
        <PropertiesTable />
      </main>
    </div>
  );
}


