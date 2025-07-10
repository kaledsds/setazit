// types/car.ts
export interface Car {
  id: number;
  image: string;
  title: string;
  price: string;
  make: string;
  model: string;
  year: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  status: "In Stock" | "Out of Stock";
  statusColor: string;
}
