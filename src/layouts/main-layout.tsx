import Footer from "@/components/bloc/landing/Footer";
import MobileSidebar from "@/components/bloc/layout/MobileSidebar";
import Navbar from "@/components/bloc/layout/Navbar";
import Sidebar from "@/components/bloc/layout/Sidebar ";
import AuthGuard from "./auth-guard";
import { SessionTypeGuard } from "./session-type-guard";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <AuthGuard>
      <SessionTypeGuard>
        <div className="flex min-h-screen">
          <Sidebar />
          <MobileSidebar />

          <div className="ml-0 flex flex-1 flex-col">
            <Navbar />
            <main className="flex-1 bg-slate-100 dark:bg-black">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </SessionTypeGuard>
    </AuthGuard>
  );
};
