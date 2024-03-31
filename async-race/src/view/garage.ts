import { createElement, carImage, flagImage } from '../components/functions';
import {
  getCars,
  getCar,
  createCar,
  deleteCar,
  updateCar,
  getRandomCars,
  getCarsCount,
  toggleCarsEngine,
  resetRace,
  resetCar,
  animateCar,
  getWinner,
  deleteWinner,
  getWinners,
  getWinnersCount,
} from '../components/garageControl';
import { Car, CarCreate, CarEngine, Winner, Win } from '../types/types';
import { unexpStatus } from '../components/errorMessages';

let selectedCar = 0;
let page = 1;
let winPage = 1;
let isRace = false;
const pageLimit = 7;
const winPageLimit = 10;
const generateCount = 100;
const winCar: Winner = {
  name: '',
  color: '',
  id: -1,
  time: 0,
  count: 0,
};

const saveInfoCar: {
  idCar: number;
  name: string;
  color: string;
  updName: string;
  updColor: string;
} = {
  idCar: 0,
  name: '',
  color: '',
  updName: '',
  updColor: '',
};

export async function garageInit(): Promise<void> {
  document.body.innerHTML = '';
  if (saveInfoCar.idCar !== 0) selectedCar = saveInfoCar.idCar;
  const carsCount = (await getCarsCount()) as number;
  const settingsDiv = createElement('div', ['settings']);
  const btnDiv = createElement('div', ['wrap-div']);
  const garageView = createElement('button', ['button'], 'To Garage');
  garageView.addEventListener('click', garageInit);
  const winnerView = createElement('button', ['button'], 'To Winners');

  btnDiv.append(garageView, winnerView);

  const createDiv = createElement('div', ['createCar']);
  const carName = createElement('input', ['carName']) as HTMLInputElement;
  carName.type = 'text';
  carName.placeholder = 'Car Name';
  if (saveInfoCar.name !== '') {
    carName.value = saveInfoCar.name;
    carName.placeholder = saveInfoCar.name;
  }
  const carColor = createElement('input', ['carColor']) as HTMLInputElement;
  carColor.type = 'color';
  if (saveInfoCar.color !== '') {
    carColor.value = saveInfoCar.color;
  }
  const createCarBtn = createElement('button', ['button'], 'Create');
  createDiv.append(carName, carColor, createCarBtn);

  const updateDiv = createElement('div', ['wrap-div']);
  const newCarName = createElement('input', ['newCarName']) as HTMLInputElement;
  newCarName.type = 'text';
  newCarName.placeholder = 'Car Name';
  if (saveInfoCar.updName !== '') {
    newCarName.value = saveInfoCar.updName;
    newCarName.placeholder = saveInfoCar.updName;
  }
  const newCarColor = createElement('input', ['newCarColor']) as HTMLInputElement;
  newCarColor.type = 'color';
  if (saveInfoCar.updColor !== '') {
    newCarColor.value = saveInfoCar.updColor;
  }
  const updateCarBtn = createElement('button', ['button'], 'Update');
  updateDiv.append(newCarName, newCarColor, updateCarBtn);

  winnerView.addEventListener('click', () => {
    saveInfoCar.idCar = selectedCar;
    saveInfoCar.name = carName?.value || '';
    saveInfoCar.color = carColor?.value || '';
    saveInfoCar.updName = newCarName?.value || '';
    saveInfoCar.updColor = newCarColor?.value || '';

    winnersInit();
  });

  const raceDiv = createElement('div', ['wrap-div']);
  const raceBtn = createElement('button', ['button'], 'Race');
  raceBtn.addEventListener('click', async () => {
    resetRace();
    const cars1 = (await getCars(page, pageLimit)) as Car[];
    const promises: Promise<[CarEngine, null] | [null, Error]>[] = [];
    cars1.forEach((car) => {
      isRace = true;
      const startCar = startEngine(car.id, winCar, isRace);
      // const carItem = getCar(car.id);
      promises.push(startCar);
    });
    Promise.race(promises);
  });

  const resetBtn = createElement('button', ['button'], 'Reset');
  resetBtn.addEventListener('click', async () => {
    // const controller = new AbortController();
    const cars1 = (await getCars(page, pageLimit)) as Car[];
    cars1.forEach((car) => {
      const SVGDiv = document.querySelector(`.svg-${car.id}`) as HTMLDivElement;
      resetCar(SVGDiv);
      stopEngine(car.id);
      isRace = false;
      // controller.abort();
    });
    document.getAnimations().forEach((anime) => {
      anime.cancel();
    });
  });
  const generateBtn = createElement('button', ['button'], 'Generate Cars');

  generateBtn.addEventListener('click', async () => {
    const cars: CarCreate[] = getRandomCars(generateCount);
    const generator: Promise<void | Error>[] = cars.map((car) => createCar(car));
    await Promise.all(generator);
    const cars1 = (await getCars(page, pageLimit)) as Car[];
    drawCars(cars1);
    drawGarage();
  });
  raceDiv.append(raceBtn, resetBtn, generateBtn);

  createCarBtn.addEventListener('click', async () => {
    createCar({ name: `${carName?.value}`, color: `${carColor?.value}` });
    console.log(carName?.value, carColor?.value);
    drawGarage();
  });

  updateCarBtn.addEventListener('click', async () => {
    updateCar(selectedCar, { name: `${newCarName?.value}`, color: `${newCarColor?.value}` });
    drawGarage();
    selectedCar = 0;
  });

  const title = createElement('h1', ['title'], `Garage (${carsCount})`);
  const pageN = createElement('h2', ['pageN'], `Page #${page}`);
  settingsDiv.append(btnDiv, createDiv, updateDiv, raceDiv, title, pageN);
  document.body.append(settingsDiv);

  async function drawGarage(): Promise<void> {
    const cars = (await getCars(page, pageLimit)) as Car[];
    const carsCount = (await getCarsCount()) as number;
    title.textContent = `Garage (${carsCount})`;
    drawCars(cars);
  }
  drawGarage();

  async function startEngine(
    id: number,
    winner: Winner,
    race: boolean
  ): Promise<[CarEngine, null] | [null, Error]> {
    const [data, error] = await toggleCarsEngine(id, 'started');
    if (error) console.log(error);
    else {
      console.log(data);
      const time = Math.round(data.distance / data.velocity);
      const car = document.querySelector(`.svg-${id}`) as HTMLDivElement;
      animateCar(id, time, car, winner, race);
      return [data, null];
    }
    const func = `I can't start or stop engine`;
    return [null, unexpStatus(func)];
  }

  async function stopEngine(id: number): Promise<[CarEngine, null] | [null, Error]> {
    try {
      const [data, error] = await toggleCarsEngine(id, 'stopped');
      if (error) console.log(error);
      else {
        console.log(data);
        return [data, null];
      }
    } catch (e) {
      return [null, e as Error];
    }
    const func = `I can't start or stop engine`;
    return [null, unexpStatus(func)];
  }

  const listCars = document.createElement('ul');
  async function drawCars(cars: Car[]): Promise<void> {
    if (listCars.innerHTML !== '') listCars.innerHTML = '';

    listCars.classList.add('list-cars');
    cars.forEach((car: Car) => {
      const CarEl = document.createElement('li');
      const wrapDiv1 = createElement('div', ['wrap-div']);
      const selectBtn = createElement('button', ['button', 'button-select'], 'SELECT');
      const removeBtn = createElement('button', ['button', 'button-remove'], 'REMOVE');
      selectBtn.id = `${car.id}`;
      selectBtn.addEventListener('click', async () => {
        selectedCar = car.id;
        const updatingCar = await getCar(selectedCar);
        newCarName.placeholder = `${updatingCar.name}`;
        newCarName.value = `${updatingCar.name}`;
        newCarColor.value = `${updatingCar.color}`;
        saveInfoCar.updName = updatingCar.name;
        saveInfoCar.updColor = updatingCar.color;
      });
      removeBtn.id = `${car.id}`;
      removeBtn.addEventListener('click', async () => {
        deleteCar(car.id);
        const isWinCar = await getWinner(car.id);
        if (isWinCar) deleteWinner(car.id);
        drawGarage();
      });
      const h3 = createElement('h3', ['list-item'], car.name);
      wrapDiv1.append(selectBtn, removeBtn, h3);
      const wrapDiv2 = createElement('div', ['wrap-div', 'race-track']);
      const aBtn = createElement('button', ['button', 'neon'], 'A');
      aBtn.id = `${car.id}`;
      const bBtn = createElement('button', ['button', 'neon'], 'B');
      bBtn.id = `${car.id}`;
      const carSVG = document.createElement('div');
      // const svg = carSVG.querySelector('svg') as SVGElement;
      const flagSVG = document.createElement('div');

      wrapDiv2.append(aBtn, bBtn, carSVG, flagSVG);
      carSVG.innerHTML = carImage(car.color);
      carSVG.classList.add(`svg-${car.id}`);
      flagSVG.innerHTML = flagImage();
      flagSVG.classList.add('flag');
      aBtn.addEventListener('click', async () => {
        await startEngine(car.id, winCar, isRace);
      });
      bBtn.addEventListener('click', async () => {
        document.getAnimations().forEach((anime) => {
          if (anime.id === bBtn.id) anime.cancel();
        });
        resetCar(carSVG);
        stopEngine(car.id);
      });
      CarEl.append(wrapDiv1, wrapDiv2);
      listCars.append(CarEl);
    });
    document.body.append(listCars);
    const carsCount = (await getCarsCount()) as number;
    checkPagination(carsCount, page, pageLimit);
  }

  async function checkPagination(total: number, currPage: number, limit: number): Promise<void> {
    if (document.querySelector('.wrap-div-control')) {
      const delItem = document.querySelector('.wrap-div-control');
      delItem?.remove();
    }
    const wrapDiv2 = createElement('div', ['wrap-div-control']) as HTMLDivElement;
    const prevBtn = createElement('button', ['button'], 'PREV') as HTMLButtonElement;
    const nextBtn = createElement('button', ['button'], 'NEXT') as HTMLButtonElement;

    wrapDiv2.append(prevBtn, nextBtn);
    document.body.append(wrapDiv2);
    const isLastPage: boolean = total / (currPage * limit) <= 1;

    if (currPage === 1) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
      prevBtn.addEventListener('click', async () => {
        page -= 1;
        drawGarage();
        pageN.textContent = `Page #${page}`;
        const carsCount = (await getCarsCount()) as number;
        checkPagination(carsCount, page, pageLimit);
      });
    }

    if (isLastPage) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
      nextBtn.addEventListener('click', async () => {
        page += 1;
        drawGarage();
        pageN.textContent = `Page #${page}`;
        const carsCount = (await getCarsCount()) as number;
        checkPagination(carsCount, page, pageLimit);
      });
    }
  }

  const removeArr = document.querySelectorAll('.button-remove');
  if (removeArr)
    removeArr.forEach((btn, key) =>
      btn.addEventListener('click', async () => {
        deleteCar(key);
        const isWinCar = await getWinner(key);
        if (isWinCar) deleteWinner(key);
        drawGarage();
      })
    );
  window.addEventListener('DOMContentLoaded', async () => {
    drawGarage();
  });
}

export async function winnersInit(): Promise<void> {
  document.body.innerHTML = '';
  const winsCount = (await getWinnersCount()) as number;
  const settingsDiv = createElement('div', ['settings']);
  const btnDiv = createElement('div', ['wrap-div']);
  const garageView = createElement('button', ['button'], 'To Garage');
  garageView.addEventListener('click', garageInit);
  const winnerView = createElement('button', ['button'], 'To Winners');
  winnerView.addEventListener('click', winnersInit);

  btnDiv.append(garageView, winnerView);

  const title = createElement('h1', ['title'], `Winners (${winsCount})`);
  const pageN = createElement('h2', ['pageN'], `Page #${winPage}`);
  settingsDiv.append(btnDiv, title, pageN);
  document.body.append(settingsDiv);
  getWinners(winPage, winPageLimit);

  async function drawWinners(): Promise<void> {
    const wins = (await getWinners(winPage, winPageLimit)) as Win[];
    const winsCount = (await getWinnersCount()) as number;
    title.textContent = `Winners (${winsCount})`;
    drawWins(wins);
  }
  drawWinners();

  const listWinners = document.createElement('table');
  async function drawWins(wins: Win[]): Promise<void> {
    if (listWinners.innerHTML !== '') listWinners.innerHTML = '';

    listWinners.classList.add('list-winners');
    const tr1 = document.createElement('tr');
    const th1 = createElement('th', ['th'], 'Number');
    const th2 = createElement('th', ['th'], 'Car');
    const th3 = createElement('th', ['th'], 'Name');
    const th4 = createElement('th', ['th'], 'Wins');
    const th5 = createElement('th', ['th'], 'Best time (seconds)');
    tr1.append(th1, th2, th3, th4, th5);
    listWinners.append(tr1);

    wins.forEach(async (win: Win, id: number) => {
      const tr = document.createElement('tr');
      const th1 = createElement('th', ['cell'], `${id + 1}`);
      const th2 = createElement('th', ['cell']);
      const car = await getCar(win.id);
      th2.innerHTML = carImage(car.color);
      const th3 = createElement('th', ['cell'], `${car.name}`);
      const th4 = createElement('th', ['cell'], `${win.wins}`);
      const th5 = createElement('th', ['cell'], `${win.time}`);
      tr.append(th1, th2, th3, th4, th5);
      listWinners.append(tr);
      // const wrapDiv1 = createElement('div', ['wrap-div']);
      // const selectBtn = createElement('button', ['button', 'button-select'], 'SELECT');
      // const removeBtn = createElement('button', ['button', 'button-remove'], 'REMOVE');
      // selectBtn.id = `${win.id}`;
      // removeBtn.id = `${win.id}`;
      // const h3 = createElement('h3', ['list-item'], win.name);
      // wrapDiv1.append(selectBtn, removeBtn, h3);
      // const wrapDiv2 = createElement('div', ['wrap-div', 'race-track']);
      // const aBtn = createElement('button', ['button', 'neon'], 'A');
      // aBtn.id = `${win.id}`;
      // const bBtn = createElement('button', ['button', 'neon'], 'B');
      // bBtn.id = `${win.id}`;
      // const carSVG = document.createElement('div');
      // // const svg = carSVG.querySelector('svg') as SVGElement;
      // const flagSVG = document.createElement('div');

      // wrapDiv2.append(aBtn, bBtn, carSVG, flagSVG);
      // carSVG.innerHTML = carImage(win.color);
      // carSVG.classList.add(`svg-${win.id}`);
      // flagSVG.innerHTML = flagImage();
      // flagSVG.classList.add('flag');
      // CarEl.append(wrapDiv1, wrapDiv2);
      // listWinners.append(CarEl);
    });
    document.body.append(listWinners);
    // const carsCount = (await getCarsCount()) as number;
    // checkPagination(carsCount, page, pageLimit);
  }
}
