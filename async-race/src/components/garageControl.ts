import '../style.css';
import { HTTPStatusCode } from '../types/httpstatuscode';
import { GetCarsResult, Car, CarCreate, CarEngine } from '../types/types';
import { brands } from './brands';
import { models } from './models';
import { getRandomColor } from './functions';
import { unexpStatus } from './errorMessages';

const BASE = 'http://localhost:3000';
const GARAGE = `${BASE}/garage`;
const ENGINE = `${BASE}/engine`;

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
    if (result.status === HTTPStatusCode._OK) return;
    if (result.status === HTTPStatusCode._NOT_FOUND) return;
  } catch (e) {
    return e as Error;
  }
}

function getRandomModels(): string {
  const mark: string = brands[Math.floor(Math.random() * brands.length)];
  const model: string = models[Math.floor(Math.random() * models.length)];
  return `${mark} ${model}`;
}

export function getRandomCars(count: number): CarCreate[] {
  return Array(count)
    .fill(null)
    .map(() => ({ name: getRandomModels(), color: getRandomColor() }));
}

export async function getCarsCount(): Promise<number | Error> {
  try {
    const response = await fetch(`${GARAGE}`);
    const cars: Car[] = await response.json();
    const carsCount = cars.length;
    return carsCount;
  } catch (e) {
    return e as Error;
  }
}

export async function toggleCarsEngine(
  id: number,
  status: 'started' | 'stopped'
): Promise<[CarEngine, null] | [null, Error]> {
  try {
    const result = await fetch(`${ENGINE}?id=${id}&status=${status}`, {
      method: 'PATCH',
    });

    if (result.status === HTTPStatusCode._OK) {
      const data: CarEngine = await result.json();
      return [data, null];
    }
    const func = `I can't start or stop engine`;
    return [null, unexpStatus(func)];
  } catch (e) {
    return [null, e as Error];
  }
}

export async function carDriveMode(
  id: number
): Promise<{ success: boolean } | null | void | Error> {
  try {
    const result = await fetch(`${ENGINE}?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    if (result.status === HTTPStatusCode._OK) {
      console.log(result);
      const data: { success: boolean } = await result.json();
      console.log(data);
      return data;
    }

    if (result.status === HTTPStatusCode._ENGINE_BROKE) {
      console.warn(`Engine is broken`);
    }

    return null;
  } catch (e) {
    return e as Error;
  }
}

export function animateCar(id: number, time: number, carImage: HTMLDivElement): void {
  const carStyle = getComputedStyle(carImage);
  const parentStyle = getComputedStyle(carImage.parentElement as HTMLDivElement);
  const carWidth = parseInt(carStyle.width);
  const parentWidth = parseInt(parentStyle.width);

  const svg = carImage.querySelector('svg') as SVGElement;

  const animation = svg.animate(
    [
      { transform: 'translateX(0px)' },
      { transform: `translateX(calc(${parentWidth}px - ${carWidth * 2}px))` },
    ],
    {
      duration: time,
      easing: 'ease-in-out',
    }
  );
  animation.id = `${id}`;
  animation.play();
  animation.onfinish = (): void => {
    svg.style.transform = `translateX(calc(${parentWidth}px - ${carWidth * 2}px))`;
  };
  (async () => {
    try {
      const response = await fetch(`${ENGINE}?id=${id}&status=drive`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Server error');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      animation.pause();
      console.error('Error:', error);
    }
  })();
}

export function resetCar(carImage: HTMLDivElement): void {
  const svg = carImage.querySelector('svg') as SVGElement;
  svg.style.transform = 'translateX(0px)';
}
