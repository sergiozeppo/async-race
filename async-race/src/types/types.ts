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

export interface CarEngine {
  velocity: number;
  distance: number;
}

export interface Winner extends Car {
  time: number;
  count: number;
}

export interface Win {
  id: number;
  wins: number;
  time: number;
}

export interface UpdateWin {
  wins: number;
  time: number;
}

export type GetCarsResult = Promise<Car[] | ErrorConstructor>;
export type GetWinsResult = Promise<Win[] | ErrorConstructor>;
export type GetCarResult = Promise<Car | ErrorConstructor>;
