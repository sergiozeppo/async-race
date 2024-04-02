import { Winner } from '../types/types';

export function createElement(
  tag: string,
  classes?: string[],
  text?: string,
  parent?: HTMLElement
): HTMLElement {
  const element = document.createElement(tag);
  if (text) {
    element.textContent = text;
  }

  if (classes) {
    if (classes.length > 0) {
      element.classList.add(...classes);
    }
  }
  if (parent != null) {
    parent.appendChild(element);
  }
  return element;
}

export function carImage(color: string): string {
  return `
  <svg width="122.88" height="50" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="10.4038mm" height="4.2332mm" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
  viewBox="0 0 1040.38 423.32"
   xmlns:xlink="http://www.w3.org/1999/xlink">
   <defs>
    <style type="text/css">
     <![CDATA[
      .fil4 {fill:#412B3B;fill-rule:nonzero}
      .fil0 {fill:#000;fill-rule:nonzero}
      .fil8 {fill:#97262A;fill-rule:nonzero}
      .fil6 {fill:#000;fill-rule:nonzero}
      .fil2 {fill:#CAF2F4;fill-rule:nonzero}
      .fil5 {fill:#D6D6D6;fill-rule:nonzero}
      .fil7 {fill:#000;fill-rule:nonzero}
      .fil3 {fill:#E8DBCD;fill-rule:nonzero}
      .fil9 {fill:#FBD63F;fill-rule:nonzero}
     ]]></style> </defs>
   <g id="Слой_x0020_1">
    <metadata id="CorelCorpID_0Corel-Layer"/>
    <g id="_2063401796096">
     <polygon class="fil0" points="973.03,345.57 41.39,345.57 41.39,210.1 973.03,210.1 "/>
     <path fill="${color}" d="M51.82 315.48c0,-53.83 43.64,-97.47 97.48,-97.47 53.83,0 97.47,43.64 97.47,97.47 0,10.51 -1.68,20.61 -4.76,30.09l526.77 0c-3.07,-9.48 -4.75,-19.58 -4.75,-30.09 0,-53.83 43.64,-97.47 97.47,-97.47 53.83,0 97.48,43.64 97.48,97.47 0,10.51 -1.68,20.61 -4.76,30.09l82.77 0c-7.1,-89.35 -18.27,-155.35 -70.05,-177.68 -51.79,-22.34 -186.83,-28.44 -211.2,-35.54 -20.77,-6.06 -108.28,-85.5 -133.68,-108.84 -4.41,-4.04 -10.88,-5.09 -16.48,-3.1 -13.79,4.9 -51.6,7.43 -50.62,10.9 3.81,13.46 110.42,105.1 110.42,105.1l-447.77 -13.2c0,0 -122.86,-50.77 -138.09,-54.83 -15.23,-4.06 -14.21,7.11 -26.4,28.43 -12.18,21.32 20.31,24.37 20.31,24.37 0,0 -21.32,7.11 -36.55,26.4 -15.23,19.29 -33.51,197.99 -33.51,197.99l53.21 0c-3.08,-9.48 -4.76,-19.58 -4.76,-30.09z"/>
     <path class="fil2" d="M630.59 31.31c0,0 -6.84,37.08 83.02,101.8l45.21 0 0 0c-1.15,-0.25 -2.2,-0.51 -3.08,-0.76 -18.85,-5.5 -92.68,-71.45 -125.15,-101.04z"/>
     <path class="fil3" d="M398.09 129.22c3.35,0.05 4.28,-1.97 2.07,-4.49l-49.07 -55.83c-2.21,-2.52 -6.76,-4.58 -10.11,-4.58l-19.81 0c-3.35,0 -4.52,2.25 -2.6,4.99l37.95 54.36c1.92,2.75 6.23,5.04 9.58,5.08l31.99 0.47z"/>
     <path class="fil4" d="M79.52 68.38c-15.23,-4.06 -14.21,7.11 -26.4,28.43 -12.18,21.32 20.31,24.37 20.31,24.37 0,0 89.4,0.42 144.18,2.03 0,0 -122.86,-50.77 -138.09,-54.83z"/>
     <path class="fil4" d="M234.92 317.59c0,47.66 -38.64,86.31 -86.3,86.31 -47.66,0 -86.31,-38.65 -86.31,-86.31 0,-47.67 38.65,-86.3 86.31,-86.3 47.66,0 86.3,38.63 86.3,86.3z"/>
     <path class="fil5" d="M191.54 317.59c0,23.7 -19.22,42.91 -42.92,42.91 -23.71,0 -42.92,-19.21 -42.92,-42.91 0,-23.7 19.21,-42.92 42.92,-42.92 23.7,0 42.92,19.22 42.92,42.92z"/>
     <path class="fil4" d="M949.21 317.59c0,47.66 -38.64,86.31 -86.3,86.31 -47.65,0 -86.3,-38.65 -86.3,-86.31 0,-47.67 38.65,-86.3 86.3,-86.3 47.66,0 86.3,38.63 86.3,86.3z"/>
     <path class="fil5" d="M905.83 317.59c0,23.7 -19.22,42.91 -42.92,42.91 -23.7,0 -42.91,-19.21 -42.91,-42.91 0,-23.7 19.21,-42.92 42.91,-42.92 23.7,0 42.92,19.22 42.92,42.92z"/>
     <path class="fil6" d="M416.99 345.57c-1.93,-6.53 -47.08,-159.18 -47.08,-177.68 0,-19.81 29.47,-38.58 30.69,-39.29l7.51 0.22c-0.26,0.16 -32.11,22.76 -32.11,39.07 0,14.1 31.07,122.69 47.36,177.68l-6.37 0z"/>
     <path class="fil7" d="M448 175.77c0,13.61 -11.03,24.64 -24.64,24.64 -13.61,0 -24.64,-11.03 -24.64,-24.64 0,-13.61 11.03,-24.64 24.64,-24.64 13.61,0 24.64,11.03 24.64,24.64z"/>
     <path class="fil4" d="M436.94 183.48c16.08,0 16.09,-7.7 16.09,-7.71 0,-0.02 -0.01,-7.71 -16.09,-7.71 -16.1,0 -43.25,-3.21 -43.25,7.71 0,10.92 27.15,7.71 43.25,7.71z"/>
     <path class="fil8" d="M17.64 231.29c44.48,14.66 56.8,-74.83 40.82,-80.16 -16,-5.33 -26.08,6.28 -26.08,6.28 -5.05,15.21 -10.2,43.63 -14.74,73.88l0 0z"/>
     <path class="fil9" d="M964.28 166.82c-0.56,0.48 -11.61,10.3 6.21,33.56 18.27,23.85 39.88,21.7 43.3,18.21 -10.15,-23.76 -24.81,-41.2 -46.85,-50.7 -0.85,-0.37 -1.77,-0.72 -2.66,-1.07z"/>
     <path class="fil6" d="M646.88 94.29c7.24,0 13.1,10.7 13.1,23.91 0,2.6 -0.24,5.08 -0.66,7.42l24.81 19.85 0 17.45 -26.79 -30.37c-2.39,5.8 -6.18,9.56 -10.46,9.56 -7.22,0 -13.08,-10.7 -13.08,-23.91 0,-13.21 5.86,-23.91 13.08,-23.91z"/>
    </g>
   </g></svg>`;
}

export function flagImage(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg fill="#000" width="50px" height="50px" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
   <path d="m754.5 454.16c46.441 23.23 97.223 34.871 149.5 34.871 44.953 0 91.391-8.7344 133.51-27.59v178.48c-47.941 23.258-79.824 30.504-133.51 30.504-15.984 0-31.969-1.4883-47.867-2.9141v-576.11c15.898 0 31.883 1.5 47.867 2.9141 59.52 0 78.324-4.332 133.51-24.637v178.46c-42.121 17.398-88.559 27.551-133.51 27.551-59.473 0-95.809-8.6992-149.5-34.801-40.633-18.887-66.684-26.137-111.72-26.137-44.953 0-72.504 7.2461-111.71 26.137-47.867 23.23-98.652 34.801-150.93 34.801-65.258 0-130.6-20.316-187.21-56.605l1.5 214.75c59.438 37.754 116.04 55.188 185.71 55.188 60.938 0 95.809-8.7344 149.51-34.871 40.621-18.816 68.172-26.102 113.12-26.102 45.035 0.003906 71.086 7.2891 111.72 26.105m-237.91 185.75c-43.535 20.34-50.773 23.258-98.676 29.016l-0.003906-577.52c43.488-4.332 87.023-15.949 126.24-34.801 36.289-17.398 59.508-23.219 98.641-23.219v577.51c-44.961 0-87.07 8.7148-126.2 29.016m13.078 29.02c-53.699 26.137-89.953 33.371-149.51 33.371-71.09 0-129.11-49.32-188.63-87.07l1.418 584.77h-63.84l-1.418-1200h65.258c55.199 39.203 121.95 60.938 190.13 60.938 50.773 0 101.55-11.566 146.59-34.789 40.605-20.328 68.156-26.148 113.11-26.148 45.035 0 71.09 5.8203 111.72 26.137 55.188 26.137 90.023 34.789 150.91 34.789 63.84 0 110.29-13.066 166.89-44.953l-1.4141 644.28c-56.605 30.469-101.64 42.047-165.48 42.047-60.887 0-95.734-7.2461-150.91-33.371-34.801-17.398-72.504-26.113-111.72-26.113-39.121 0-78.324 8.7109-113.11 26.113" fill-rule="evenodd"/>
  </svg>
  `;
}

export function getRandomColor(): string {
  const letters: string = '0123456789ABCDEF';
  let color: string = '#';
  const colorLength: number = 6;
  const hex: number = 16;
  for (let i = 0; i < colorLength; i += 1) {
    color += letters[Math.floor(Math.random() * hex)];
  }
  return color;
}

export function deleteItems(div: HTMLDivElement, tag: string): void {
  const cards = div.querySelectorAll(tag);
  for (let i = 0; i < cards.length; i += 1) {
    cards[i].remove();
  }
}

export function winnerModal(winner: Winner): void {
  const modal = createElement('div', ['modal', 'visible'], '');
  const resultCreate = createElement('div', ['result'], '', modal);
  const seconds = 1000;
  const point = 2;
  const greetCreate = createElement(
    'h3',
    ['greeting'],
    ` The car ${winner.name} won the race with the best time ${(winner.time / seconds).toFixed(point)}!`
  );
  greetCreate.innerHTML += `<br>${carImage(winner.color)}`;
  resultCreate.appendChild(greetCreate);
  document.body.appendChild(modal);
  window.addEventListener('click', () => {
    modal.classList?.remove('visible');
    modal.remove();
  });
}
