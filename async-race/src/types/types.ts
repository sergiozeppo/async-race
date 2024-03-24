export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface CarCreate {
  name: string;
  color: string;
}

export interface GarageData {
  cars: Car[];
  count: number;
}

export type GetCarsResult = Promise<Car[] | ErrorConstructor>;
export type GetCarResult = Promise<Car | ErrorConstructor>;
