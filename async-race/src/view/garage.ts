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
} from '../components/garageControl';
import { Car, CarCreate, CarEngine } from '../types/types';

let selectedCar = 0;
let page = 1;
const pageLimit = 7;
const generateCount = 100;

export async function garageInit(): Promise<void> {
  const carsCount = (await getCarsCount()) as number;
  const settingsDiv = createElement('div', ['settings']);
  const btnDiv = createElement('div', ['wrap-div']);
  const garageView = createElement('button', ['button'], 'To Garage');
  const winnerView = createElement('button', ['button'], 'To Winners');
  btnDiv.append(garageView, winnerView);

  const createDiv = createElement('div', ['createCar']);
  const carName = createElement('input', ['carName']) as HTMLInputElement;
  carName.type = 'text';
  carName.placeholder = 'Car Name';
  const carColor = createElement('input', ['carColor']) as HTMLInputElement;
  carColor.type = 'color';
  const createCarBtn = createElement('button', ['button'], 'Create');
  createDiv.append(carName, carColor, createCarBtn);

  const updateDiv = createElement('div', ['wrap-div']);
  const newCarName = createElement('input', ['newCarName']) as HTMLInputElement;
  newCarName.type = 'text';
  newCarName.placeholder = 'Car Name';
  const newCarColor = createElement('input', ['newCarColor']) as HTMLInputElement;
  newCarColor.type = 'color';
  const updateCarBtn = createElement('button', ['button'], 'Update');
  updateDiv.append(newCarName, newCarColor, updateCarBtn);

  const raceDiv = createElement('div', ['wrap-div']);
  const raceBtn = createElement('button', ['button'], 'Race');
  const resetBtn = createElement('button', ['button'], 'Reset');
  const generateBtn = createElement('button', ['button'], 'Generate Cars');

  generateBtn.addEventListener('click', async () => {
    const cars: CarCreate[] = getRandomCars(generateCount);
    const generator: Promise<void | Error>[] = cars.map((car) => createCar(car));
    await Promise.all(generator);
    const cars1 = (await getCars(page, pageLimit)) as Car[];
    drawCars(cars1);
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
    drawCars(cars);
  }
  drawGarage();

  async function startEngine(id: number): Promise<CarEngine | void | Error> {
    const data = await toggleCarsEngine(id, 'started');
    if (data) {
      console.log(data);
      return data;
    }
  }

  async function stopEngine(id: number): Promise<CarEngine | void | Error> {
    const data = await toggleCarsEngine(id, 'stopped');
    if (data) {
      console.log(data);
      return data;
    }
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
      });
      removeBtn.id = `${car.id}`;
      removeBtn.addEventListener('click', () => {
        deleteCar(car.id);
        drawGarage();
      });
      const h3 = createElement('h3', ['list-item'], car.name);
      wrapDiv1.append(selectBtn, removeBtn, h3);
      const wrapDiv2 = createElement('div', ['wrap-div', 'race-track']);
      const aBtn = createElement('button', ['button', 'neon'], 'A');

      const bBtn = createElement('button', ['button', 'neon'], 'B');
      bBtn.addEventListener('click', async () => {
        stopEngine(car.id);
      });
      const carSVG = document.createElement('div');
      const flagSVG = document.createElement('div');
      aBtn.addEventListener('click', async () => {
        startEngine(car.id);
      });
      wrapDiv2.append(aBtn, bBtn, carSVG, flagSVG);
      carSVG.innerHTML = carImage(car.color);
      flagSVG.innerHTML = flagImage();
      flagSVG.classList.add('flag');
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
      btn.addEventListener('click', () => {
        deleteCar(key);
        drawGarage();
      })
    );
  window.addEventListener('DOMContentLoaded', async () => {
    drawGarage();
  });
}
