import Footer from "@/components/bloc/landing/Footer";
import Header from "@/components/bloc/landing/Header";
import { Children } from "react";
interface MainLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
