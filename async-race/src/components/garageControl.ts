import '../style.css';
import { HTTPStatusCode } from '../types/httpstatuscode';
import {
  GetCarsResult,
  Car,
  CarCreate,
  CarEngine,
  Winner,
  Win,
  UpdateWin,
  GetWinsResult,
  Sort,
  SortDirection,
} from '../types/types';
import { brands } from './brands';
import { models } from './models';
import { getRandomColor, winnerModal } from './functions';
import { unexpStatus } from './errorMessages';

const BASE = 'http://localhost:3000';
const GARAGE = `${BASE}/garage`;
const ENGINE = `${BASE}/engine`;
const WINNERS = `${BASE}/winners`;
let isWin = false;

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
    await fetch(`${GARAGE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
  } catch (e) {
    return e as Error;
  }
}

export async function deleteCar(id: number): Promise<void | Error> {
  try {
    await fetch(`${GARAGE}/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {
    return e as Error;
  }
}

export async function updateCar(id: number, car: CarCreate): Promise<void | Error> {
  try {
    await fetch(`${GARAGE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
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
      const data: { success: boolean } = await result.json();
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

export async function deleteWinner(id: number): Promise<void | Error> {
  try {
    await fetch(`${WINNERS}/${id}`, {
      method: 'DELETE',
    });
  } catch (e) {
    return e as Error;
  }
}

async function updateWinner(id: number, car: UpdateWin): Promise<void | Error> {
  try {
    await fetch(`${WINNERS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
  } catch (e) {
    return e as Error;
  }
}

async function createWinner(winner: Win): Promise<void | Error> {
  try {
    const result = await fetch(`${WINNERS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winner),
    });

    if (result.status === HTTPStatusCode._ENGINE_BROKE) {
      const winnerUpdate = (await getWinner(winner.id)) as Win;
      winnerUpdate.wins += 1;
      if (winner.time < winnerUpdate.time) winnerUpdate.time = winner.time;
      const updating: UpdateWin = {
        wins: winnerUpdate.wins,
        time: winnerUpdate.time,
      };
      await updateWinner(winnerUpdate.id, updating);
    }
  } catch (e) {
    return e as Error;
  }
}

export async function getWinner(id: number): Promise<Win | null | Error> {
  try {
    const response = await fetch(`${WINNERS}?id=${id}`);
    if (response.status === HTTPStatusCode._OK) {
      const winner: Win[] = await response.json();
      return winner[0];
    }

    if (response.status === HTTPStatusCode._NOT_FOUND) {
      console.warn(`Car not found, but added`);
    }

    return null;
  } catch (e) {
    return e as Error;
  }
}

export async function getWinners(
  page: number,
  limit: number,
  sort?: Sort,
  order?: SortDirection
): GetWinsResult {
  try {
    const response = await fetch(
      `${WINNERS}?_limit=${limit}&_page=${page}${sort ? `&_sort=${sort}` : ''}${order ? `&_order=${order}` : ''}`
    );
    const wins: Win[] = await response.json();
    return wins;
  } catch (e) {
    return Error;
  }
}

export async function getWinnersCount(): Promise<number | Error> {
  try {
    const response = await fetch(`${WINNERS}`);
    const wins: Win[] = await response.json();
    const winsCount = wins.length;
    return winsCount;
  } catch (e) {
    return e as Error;
  }
}

export function resetRace(): void {
  isWin = false;
}

export function animateCar(
  id: number,
  time: number,
  carImage: HTMLDivElement,
  winner: Winner,
  race: boolean
): [number, number] {
  const carStyle = getComputedStyle(carImage);
  const parentStyle = getComputedStyle(carImage.parentElement as HTMLDivElement);
  const decimal = 10;
  const carWidth = parseInt(carStyle.width, decimal);
  const parentWidth = parseInt(parentStyle.width, decimal);
  const svg = carImage.querySelector('svg') as SVGElement;
  const dblSize = 2;

  const animation = svg.animate(
    [
      { transform: 'translateX(0px)' },
      { transform: `translateX(calc(${parentWidth}px - ${carWidth * dblSize}px))` },
    ],
    {
      duration: time,
      easing: 'ease-in-out',
    }
  );
  animation.id = `${id}`;
  animation.play();
  animation.onfinish = (): void => {
    svg.style.transform = `translateX(calc(${parentWidth}px - ${carWidth * dblSize}px))`;
  };
  (async (): Promise<void> => {
    try {
      const response = await fetch(`${ENGINE}?id=${id}&status=drive`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Server error');
      }
      await response.json();
      if (race) {
        if (!isWin) {
          const car = await getCar(id);
          winner.id = car.id;
          winner.name = car.name;
          winner.color = car.color;
          winner.time = time;
          winner.count += 1;
          race = false;
          isWin = true;
          if (isWin) {
            const seconds = 1000;
            const point = 2;
            toggleButtons(false);
            winnerModal(winner);
            const winner1: Win = {
              id: winner.id,
              wins: 1,
              time: +(time / seconds).toFixed(point),
            };
            await createWinner(winner1);
          }
        }
      }
    } catch (error) {
      animation.pause();
      console.error('Error:', error);
    }
  })();
  return [id, time];
}

export function resetCar(carImage: HTMLDivElement): void {
  const svg = carImage.querySelector('svg') as SVGElement;
  svg.style.transform = 'translateX(0px)';
}

export function toggleButtons(onoff: boolean): void {
  const buttons = document.querySelectorAll('button');
  if (buttons) {
    buttons.forEach((button) => {
      if (onoff) button.disabled = true;
      else button.disabled = false;
    });
  }
}
