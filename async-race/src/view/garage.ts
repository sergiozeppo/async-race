import { createElement, carImage } from '../components/functions';
import { getCars, getCar, createCar, deleteCar, updateCar } from '../components/garageButtons';
import { Car } from '../types/types';

let selectedCar = 0;

export function garageInit(): void {
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
  raceDiv.append(raceBtn, resetBtn, generateBtn);
  settingsDiv.append(btnDiv, createDiv, updateDiv, raceDiv);
  document.body.append(settingsDiv);

  createCarBtn.addEventListener('click', async () => {
    createCar({ name: `${carName?.value}`, color: `${carColor?.value}` });
    console.log(carName?.value, carColor?.value);
    const cars = (await getCars(1, 7)) as Car[];
    drawCars(cars);
  });

  updateCarBtn.addEventListener('click', async () => {
    updateCar(selectedCar, { name: `${newCarName?.value}`, color: `${newCarColor?.value}` });
    drawGarage();
    selectedCar = 0;
  });

  async function drawGarage(): Promise<void> {
    const cars = (await getCars(1, 7)) as Car[];
    drawCars(cars);
  }
  drawGarage();

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
      const wrapDiv2 = createElement('div', ['wrap-div']);
      const aBtn = createElement('button', ['button', 'neon'], 'A');
      const bBtn = createElement('button', ['button', 'neon'], 'B');
      const carSVG = document.createElement('div');
      wrapDiv2.append(aBtn, bBtn, carSVG);
      carSVG.innerHTML = carImage(car.color);
      CarEl.append(wrapDiv1, wrapDiv2);
      listCars.append(CarEl);
    });
    document.body.append(listCars);
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
    const cars = (await getCars(1, 7)) as Car[];
    drawCars(cars);
  });
}
