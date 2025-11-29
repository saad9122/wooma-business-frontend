import { Sidebar } from "../components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <main className="flex-1 bg-background px-10 py-8">
        {/* Placeholder content area */}
      </main>
    </div>
  );
}
