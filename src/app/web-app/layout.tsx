import { Sidebar } from "@/components/web-app/sidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (<>
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />

      {children}
    </div>
  </>);
}

export default Layout;
