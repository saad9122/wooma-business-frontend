export function Sidebar() {
  const mainItems = [
    { label: "Properties", active: true, icon: "home" },
    { label: "User management", active: false, icon: "users" },
    { label: "Settings", active: false, icon: "settings" },
    { label: "Integrations", active: false, icon: "link" },
    { label: "Billing", active: false, icon: "billing" },
  ] as const;

  const footerItems = ["Profile", "Log out"] as const;

  const renderIcon = (type: (typeof mainItems)[number]["icon"]) => {
    const base =
      "flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm";

    switch (type) {
      case "home":
        return (
          <span className={base}>
            <span className="block h-3 w-3 border-b-2 border-l-2 border-current rotate-45 translate-y-[1px]" />
          </span>
        );
      case "users":
        return (
          <span className={base}>
            <span className="relative block h-3 w-4">
              <span className="absolute left-0 top-0 h-2 w-2 rounded-full border border-current" />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full border border-current" />
            </span>
          </span>
        );
      case "settings":
        return (
          <span className={base}>
            <span className="block h-3 w-3 rounded-full border border-current" />
          </span>
        );
      case "link":
        return (
          <span className={base}>
            <span className="block h-3 w-4 border-b-2 border-current" />
          </span>
        );
      case "billing":
        return (
          <span className={base}>
            <span className="block h-3 w-3 border-2 border-current" />
          </span>
        );
      default:
        return <span className={base} />;
    }
  };

  return (
    <aside className="flex h-screen w-72 flex-col justify-between bg-sidebar text-sidebar-foreground border-r border-sidebar-border px-6 py-8">
      {/* Logo */}
      <div>
        <div className="text-[20px] font-semibold tracking-[0.12em]">WOOMA</div>
        <div className="mt-1 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
          Business
        </div>

        {/* Primary CTA */}
        <button className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar">
          <span>Create report</span>
          <span className="text-lg leading-none">↗</span>
        </button>

        {/* Main navigation */}
        <nav className="mt-8 space-y-1 text-sm">
          {mainItems.map((item) => {
            const activeClasses =
              "bg-sidebar-accent text-sidebar-accent-foreground";
            const inactiveClasses =
              "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

            return (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  item.active ? activeClasses : inactiveClasses
                }`}
              >
                {renderIcon(item.icon)}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer links */}
      <div className="space-y-4 text-sm font-medium text-sidebar-foreground">
        {footerItems.map((label) => (
          <button
            key={label}
            type="button"
            className="block w-full text-left hover:text-foreground"
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
