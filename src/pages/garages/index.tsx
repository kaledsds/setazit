import { MainLayout } from "@/layouts/main-layout";
import { PaginationContextProvider } from "@/common/components/pagination/context/pagination.context";
import GarageGrid from "@/components/bloc/landing/garage/GarageGrid";

const Garages = () => {
  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        <PaginationContextProvider ressourcesName="Type">
          <GarageGrid />
        </PaginationContextProvider>
      </div>
    </MainLayout>
  );
};

export default Garages;
