// app/car-management/page.tsx
"use client";

import { useCarFilters } from "@/hooks/useCarFilters";

import { Card } from "@/components/ui/card";

import type { Car } from "@/types/car";
import { MainLayout } from "@/layouts/main-layout";
import { CarHeaderWithModal } from "@/components/bloc/car-management/CarHeaderWithModal";
import { CarStats } from "@/components/bloc/car-management/CarStats";
import { CarTable } from "@/components/bloc/car-management/CarTable";
import CarFilterSection from "@/components/bloc/car-management/CarFilterSection";
import { useState } from "react";

const sampleCars: Car[] = [
  {
    id: 1,
    image: "/images/lambo.jpg",
    title: "Lamborghini Huracán Evo",
    price: "230000",
    make: "Lamborghini",
    model: "Huracán Evo",
    year: "2023",
    fuelType: "Gasoline",
    transmission: "Automatic",
    drivetrain: "AWD",
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1617445412360-5e24bb6b81aa?w=600",
    title: "Porsche 911 Carrera",
    price: "135000",
    make: "Porsche",
    model: "911 Carrera",
    year: "2022",
    fuelType: "Gasoline",
    transmission: "Manual",
    drivetrain: "RWD",
    status: "Out of Stock",
    statusColor: "bg-red-500",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600",
    title: "Tesla Model S Plaid",
    price: "120000",
    make: "Tesla",
    model: "Model S Plaid",
    year: "2024",
    fuelType: "Electric",
    transmission: "Automatic",
    drivetrain: "AWD",
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
];

export default function CarManagementPage() {
  const {
    filters,
    filteredCars,
    updateFilters,
    sortOption,
    setSortOption,
    page,
    setPage,
    perPage,
    setPerPage,
    paginatedCars,
    totalPages,
  } = useCarFilters(sampleCars);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredParts = sampleCars.filter((car) => {
    return (
      (filters.fuelType === "" || car.fuelType === filters.fuelType) &&
      (filters.make === "" || car.make === filters.make) &&
      (filters.model === "" || car.model === filters.model) &&
      (search === "" ||
        car.title.toLowerCase().includes(search.toLowerCase()) ||
        car.transmission.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const sortedParts = [...filteredParts].sort((a, b) => {
    if (sortOption === "price-low") {
      return (
        parseFloat(a.price.replace(/[^0-9.-]+/g, "")) -
        parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
      );
    }
    if (sortOption === "price-high") {
      return (
        parseFloat(b.price.replace(/[^0-9.-]+/g, "")) -
        parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
      );
    }
    if (sortOption === "title-az") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "title-za") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const handleAddCar = () => {
    console.log("Add new car");
  };

  const handleEdit = (carId: number) => {
    console.log("Edit car:", carId);
  };

  const handleDelete = (carId: number) => {
    console.log("Delete car:", carId);
  };

  const applyFilters = () => setPage(1);
  const resetFilters = () => {
    resetFilters();
    setPage(1);
  };

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 border-0 bg-transparent">
            <CarHeaderWithModal onAddCar={handleAddCar} />
            <CarFilterSection
              onApply={applyFilters}
              onReset={resetFilters}
              isCollapsed={!filtersVisible}
              setCollapsed={() => setFiltersVisible(!filtersVisible)}
            />
          </Card>

          <CarStats
            totalCars={sampleCars.length}
            filteredCars={filteredCars.length}
          />

          <CarTable
            cars={paginatedCars}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortOption={sortOption}
            onSortChange={setSortOption}
            currentPage={page}
            onPageChange={setPage}
            perPage={perPage}
            onPerPageChange={setPerPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </MainLayout>
  );
}
