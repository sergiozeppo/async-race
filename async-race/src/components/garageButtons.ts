import '../style.css';
import { HTTPStatusCode } from '../types/httpstatuscode';
import { GetCarsResult, Car, CarCreate } from '../types/types';

const BASE = 'http://localhost:3000';
const GARAGE = `${BASE}/garage`;

export async function getCars(page: number, limit: number): GetCarsResult {
  try {
    const response = await fetch(`${GARAGE}?_limit=${limit}&_page=${page}`);
    const cars: Car[] = await response.json();
    return cars;
  } catch (e) {
    return Error;
  }
}

export async function getCar(id: number): Promise<Car> {
  try {
    const response = await fetch(`${GARAGE}/${id}`);
    const empty: Car = {
      name: '',
      color: '',
      id: 0,
    };
    if (response.status === HTTPStatusCode._OK) {
      const data: Car = await response.json();
      return data;
    }
    return empty;
  } catch (e) {
    throw e as Error;
  }
}

export async function createCar(car: CarCreate): Promise<void | Error> {
  try {
    const result = await fetch(`${GARAGE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
    console.log(JSON.stringify(car));

    if (result.status === HTTPStatusCode._CREATED) return;
  } catch (e) {
    return e as Error;
  }
}

export async function deleteCar(id: number): Promise<void | Error> {
  try {
    const result = await fetch(`${GARAGE}/${id}`, {
      method: 'DELETE',
    });
    console.log(result);
    getCars(1, 7);
    if (result.status === HTTPStatusCode._OK) return;
    if (result.status === HTTPStatusCode._NOT_FOUND) return;
  } catch (e) {
    return e as Error;
  }
}

export async function updateCar(id: number, car: CarCreate): Promise<void | Error> {
  try {
    const result = await fetch(`${GARAGE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
    getCars(1, 7);
    if (result.status === HTTPStatusCode._OK) return;
    if (result.status === HTTPStatusCode._NOT_FOUND) return;
  } catch (e) {
    return e as Error;
  }
}
