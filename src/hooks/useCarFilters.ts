// hooks/useCarFilters.ts
import { useState } from "react";
import type { Car } from "@/types/car";

export function useCarFilters(cars: Car[]) {
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    fuelType: "",
    transmission: "",
    drivetrain: "",
  });

  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const updateFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const filteredCars = cars.filter((car) => {
    return (
      (filters.make === "" || car.make === filters.make) &&
      (filters.model === "" || car.model === filters.model) &&
      (filters.year === "" || car.year === filters.year) &&
      (filters.fuelType === "" || car.fuelType === filters.fuelType) &&
      (filters.transmission === "" ||
        car.transmission === filters.transmission) &&
      (filters.drivetrain === "" || car.drivetrain === filters.drivetrain)
    );
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOption === "price-low") {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    if (sortOption === "price-high") {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    if (sortOption === "title-az") {
      return a.title.localeCompare(b.title);
    }
    if (sortOption === "title-za") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCars.length / perPage);

  const paginatedCars = sortedCars.slice((page - 1) * perPage, page * perPage);

  return {
    filters,
    updateFilters,
    sortOption,
    setSortOption,
    page,
    setPage,
    perPage,
    setPerPage,
    filteredCars,
    paginatedCars,
    totalPages,
  };
}
