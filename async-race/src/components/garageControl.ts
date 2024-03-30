import '../style.css';
import { HTTPStatusCode } from '../types/httpstatuscode';
import { GetCarsResult, Car, CarCreate, CarEngine, Winner, Win, UpdateWin } from '../types/types';
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
// export const controller = new AbortController();

export async function deleteWinner(id: number): Promise<void | Error> {
  try {
    const result = await fetch(`${WINNERS}/${id}`, {
      method: 'DELETE',
    });
    console.log(result);
    if (result.status === HTTPStatusCode._OK) return;
    if (result.status === HTTPStatusCode._NOT_FOUND) return;
  } catch (e) {
    return e as Error;
  }
}

async function updateWinner(id: number, car: UpdateWin): Promise<void | Error> {
  try {
    const result = await fetch(`${WINNERS}/${id}`, {
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

async function createWinner(winner: Win): Promise<void | Error> {
  try {
    const result = await fetch(`${WINNERS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winner),
    });
    console.log(JSON.stringify(winner));

    if (result.status === HTTPStatusCode._CREATED) return;
    if (result.status === HTTPStatusCode._ENGINE_BROKE) {
      const winnerUpdate = (await getWinner(winner.id)) as Win;
      console.log(winner);
      console.log(winnerUpdate);
      winnerUpdate.wins += 1;
      if (winner.time < winnerUpdate.time) winnerUpdate.time = winner.time;
      console.log(winnerUpdate);
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
      console.log(response);
      const winner: Win[] = await response.json();

      console.log(winner[0]);
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

export function resetRace() {
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
  const carWidth = parseInt(carStyle.width);
  const parentWidth = parseInt(parentStyle.width);
  // const signal = controller.signal;
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
        // signal,
      });
      if (!response.ok) {
        throw new Error('Server error');
      }
      // if (signal.aborted) {
      //   if (signal.reason) {
      //     console.log(`Request aborted with reason: ${signal.reason}`);
      //   } else {
      //     console.log('Request aborted but no reason was given.');
      //   }
      // }
      const data = await response.json();
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
            winnerModal(winner);
            const winner1: Win = {
              id: winner.id,
              wins: 1,
              time: +(time / 1000).toFixed(2),
            };
            await createWinner(winner1);
          }
        }
      }
      console.log(data);
      console.log(winner);
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
