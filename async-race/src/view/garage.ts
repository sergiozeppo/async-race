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
  toggleButtons,
} from '../components/garageControl';
import { Car, CarCreate, CarEngine, Winner, Win, Sort, SortDirection } from '../types/types';
import { unexpStatus } from '../components/errorMessages';

let selectedCar = 0;
let page = 1;
let winPage = 1;
let isRace = false;
let sortParam: Sort = undefined;
let ascdesc: SortDirection = undefined;
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
  const settingsDiv = createElement('div', ['settings', 'garageSet']);
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
    toggleButtons(true);
    const cars1 = (await getCars(page, pageLimit)) as Car[];
    const promises: Promise<[CarEngine, null] | [null, Error]>[] = [];
    cars1.forEach((car) => {
      isRace = true;
      const startCar = startEngine(car.id, winCar, isRace);
      promises.push(startCar);
    });
    const sec = 5000;
    Promise.race(promises).finally(() =>
      setTimeout(() => {
        toggleButtons(false);
      }, sec)
    );
  });

  const resetBtn = createElement('button', ['button'], 'Reset');
  resetBtn.addEventListener('click', async () => {
    const cars1 = (await getCars(page, pageLimit)) as Car[];
    cars1.forEach((car) => {
      const SVGDiv = document.querySelector(`.svg-${car.id}`) as HTMLDivElement;
      resetCar(SVGDiv);
      stopEngine(car.id);
      isRace = false;
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
    const carsCount4 = (await getCarsCount()) as number;
    title.textContent = `Garage (${carsCount4})`;
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
      const aBtn = createElement('button', ['button', 'neon'], 'A') as HTMLButtonElement;
      aBtn.id = `${car.id}`;
      const bBtn = createElement('button', ['button', 'neon'], 'B') as HTMLButtonElement;
      bBtn.id = `${car.id}`;
      bBtn.disabled = true;
      const carSVG = document.createElement('div');
      const flagSVG = document.createElement('div');

      wrapDiv2.append(aBtn, bBtn, carSVG, flagSVG);
      carSVG.innerHTML = carImage(car.color);
      carSVG.classList.add(`svg-${car.id}`);
      flagSVG.innerHTML = flagImage();
      flagSVG.classList.add('flag');
      aBtn.addEventListener('click', async () => {
        await startEngine(car.id, winCar, isRace);
        aBtn.disabled = true;
        bBtn.disabled = false;
      });
      bBtn.addEventListener('click', async () => {
        aBtn.disabled = false;
        document.getAnimations().forEach((anime) => {
          if (anime.id === bBtn.id) anime.cancel();
        });
        resetCar(carSVG);
        stopEngine(car.id);
        bBtn.disabled = true;
      });
      CarEl.append(wrapDiv1, wrapDiv2);
      listCars.append(CarEl);
    });
    document.body.append(listCars);
    const carsCount5 = (await getCarsCount()) as number;
    checkPagination(carsCount5, page, pageLimit);
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
        const carsCount1 = (await getCarsCount()) as number;
        checkPagination(carsCount1, page, pageLimit);
      });
    }

    if (isLastPage) {
      nextBtn.disabled = true;
      if (total % limit === 0 && currPage !== total / limit) {
        page -= 1;
        drawGarage();
        pageN.textContent = `Page #${page}`;
        const carsCount1 = (await getCarsCount()) as number;
        checkPagination(carsCount1, page, pageLimit);
      }
    } else {
      nextBtn.disabled = false;
      nextBtn.addEventListener('click', async () => {
        page += 1;
        drawGarage();
        pageN.textContent = `Page #${page}`;
        const carsCount2 = (await getCarsCount()) as number;
        checkPagination(carsCount2, page, pageLimit);
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
  const settingsDiv = createElement('div', ['settings', 'winnersSet']);
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
    const wins = (await getWinners(winPage, winPageLimit, sortParam, ascdesc)) as Win[];
    const winsCount1 = (await getWinnersCount()) as number;
    title.textContent = `Winners (${winsCount1})`;
    drawWins(wins);
  }
  drawWinners();

  function toggleAscDesc(): void {
    if (!ascdesc) {
      ascdesc = 'ASC';
    } else if (ascdesc === 'ASC') {
      ascdesc = 'DESC';
    } else ascdesc = 'ASC';
  }

  function arrowAscDesc(asc: SortDirection): string {
    return asc === 'ASC' ? '↑' : '↓';
  }

  async function drawParams(param: Sort): Promise<void> {
    const wins = (await getWinners(winPage, winPageLimit, param, ascdesc)) as Win[];
    const winsCount2 = (await getWinnersCount()) as number;
    title.textContent = `Winners (${winsCount2})`;
    drawWins(wins);
  }

  const listWinners = document.createElement('table');
  async function drawWins(wins: Win[]): Promise<void> {
    if (listWinners.innerHTML !== '') listWinners.innerHTML = '';
    listWinners.classList.add('list-winners');
    const tr1 = document.createElement('tr');
    const th = createElement('th', ['th', 'th'], 'Number');
    const th1 = createElement('th', ['th', 'heading', 'carNumber'], 'Car No.');
    th1.addEventListener('click', async () => {
      sortParam = 'id';
      toggleAscDesc();
      drawParams(sortParam);
    });
    const th2 = createElement('th', ['th'], 'Car');
    const th3 = createElement('th', ['th'], 'Name');
    const th4 = createElement('th', ['th', 'heading', 'carWins'], 'Wins');
    th4.addEventListener('click', async () => {
      sortParam = 'wins';
      toggleAscDesc();
      drawParams(sortParam);
    });
    const th5 = createElement('th', ['th', 'heading', 'bestTime'], `Best time (seconds)`);
    th5.addEventListener('click', async () => {
      sortParam = 'time';
      toggleAscDesc();
      drawParams(sortParam);
    });
    tr1.append(th, th1, th2, th3, th4, th5);
    listWinners.append(tr1);
    wins.forEach(async (win: Win, id: number) => {
      const tr = document.createElement('tr');
      const td = createElement(
        'td',
        ['cell'],
        `${(winPage - 1 > 0 ? String(winPage - 1) : '') + String(id + 1)}`
      );
      const td2 = createElement('td', ['cell']);
      const car = await getCar(win.id);
      td2.innerHTML = carImage(car.color);
      const td1 = createElement('td', ['cell'], `${car.id}`);
      const td3 = createElement('td', ['cell'], `${car.name}`);
      const td4 = createElement('td', ['cell'], `${win.wins}`);
      const td5 = createElement('td', ['cell'], `${win.time}`);
      tr.append(td, td1, td2, td3, td4, td5);
      listWinners.append(tr);
    });
    document.body.append(listWinners);
    const winsCount3 = (await getWinnersCount()) as number;
    checkPagination(winsCount3, winPage, winPageLimit);

    if (sortParam === 'id') {
      th1.textContent += arrowAscDesc(ascdesc);
    } else if (sortParam === 'wins') {
      th4.textContent += arrowAscDesc(ascdesc);
    } else if (sortParam === 'time') {
      th5.textContent += arrowAscDesc(ascdesc);
    }
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
        winPage -= 1;
        drawWinners();
        pageN.textContent = `Page #${winPage}`;
        const winsCount4 = (await getWinnersCount()) as number;
        checkPagination(winsCount4, winPage, winPageLimit);
      });
    }

    if (isLastPage) {
      nextBtn.disabled = true;
      if (total % limit === 0 && currPage !== total / limit) {
        winPage -= 1;
        drawWinners();
        pageN.textContent = `Page #${winPage}`;
        const winsCount6 = (await getWinnersCount()) as number;
        checkPagination(winsCount6, winPage, winPageLimit);
      }
    } else {
      nextBtn.disabled = false;
      nextBtn.addEventListener('click', async () => {
        winPage += 1;
        drawWinners();
        pageN.textContent = `Page #${winPage}`;
        const winsCount5 = (await getWinnersCount()) as number;
        checkPagination(winsCount5, winPage, winPageLimit);
      });
    }
  }
}
