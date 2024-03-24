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
  return `<svg fill="${color}" width="122.88" height="50" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" enable-background="new 0 0 122.88 43.49" version="1.1" xml:space="preserve">
    <style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style>
    <g class="layer">
     <g id="svg_3">
      <path class="st0" d="m19.38,24.97c-5.27,0 -9.54,4.37 -9.54,9.76c0,5.39 4.27,9.76 9.54,9.76c5.27,0 9.54,-4.37 9.54,-9.76c0,-5.39 -4.27,-9.76 -9.54,-9.76l0,0zm79.14,5.1l0,3.51l-3.43,0c0.41,-1.72 1.74,-3.09 3.43,-3.51l0,0zm-3.44,5.8l3.44,0l0,3.51c-1.69,-0.41 -3.02,-1.78 -3.44,-3.51l0,0zm5.68,3.52l0,-3.51l3.43,0c-0.41,1.72 -1.75,3.08 -3.43,3.51l0,0zm3.43,-5.8l-3.43,0l0,-3.51c1.68,0.41 3.02,1.78 3.43,3.51l0,0zm-85.93,-3.52l0,3.51l-3.43,0c0.41,-1.72 1.74,-3.09 3.43,-3.51l0,0zm-3.43,5.8l3.43,0l0,3.51c-1.69,-0.41 -3.02,-1.78 -3.43,-3.51l0,0zm5.67,3.52l0,-3.51l3.43,0c-0.41,1.72 -1.74,3.08 -3.43,3.51l0,0zm3.44,-5.8l-3.43,0l0,-3.51c1.68,0.41 3.01,1.78 3.43,3.51l0,0zm48.88,-19.8c1.51,-0.35 3,-0.35 4.51,-0.28c-11.78,-6.33 -16.41,-10.44 -30.2,-9.61l1.9,12.87l22.71,0.88c-0.21,-0.61 -0.32,-0.94 -0.36,-1.55c-0.11,-1.74 -0.09,-1.95 1.45,-2.31l0,0zm-29.17,-9.66l2.46,12.47l-23.59,-0.98c-2.42,-0.1 -2.85,-1.19 -1.38,-3.28c0.66,-0.95 1.41,-1.89 2.26,-2.82c6.1,-6.66 12.17,-5.28 20.25,-5.39l0,0zm76.91,24.15l-0.72,0c-0.45,-2.04 -1.34,-3.88 -2.65,-5.53c-2.87,-3.66 -4.18,-3.2 -8.46,-3.99l-23.92,-4.61c-5.31,-3.86 -11.71,-7.3 -19.53,-10.2c-7.24,-2.7 -12.36,-2.96 -20.11,-2.95c-4.44,0.01 -8.94,0.28 -13.5,0.84c-2.32,0.15 -4.59,0.47 -6.81,0.93c-2.67,0.55 -5.29,1.31 -7.86,2.21l-9.58,5.66c-2.83,1.67 -3.43,3.62 -3.79,6.81l-1.35,11.78l-1.4,0l0,6.51c0.2,2.19 1.04,2.52 2.82,2.52l2.32,0c-0.9,-20.59 27.43,-24.11 26.81,1.63l54.21,0c-3.65,-17.75 13.85,-23.91 22.45,-13.76c2.61,3.09 3.52,7.31 3.29,12.3l6.27,0c0.5,-0.24 0.89,-0.57 1.18,-0.98c1.03,-1.43 0.8,-5.74 0.72,-8.23c-0.01,-0.67 0.2,-0.94 -0.37,-0.94l0,0zm-20.92,-3.31c-5.27,0 -9.54,4.37 -9.54,9.76c0,5.39 4.27,9.76 9.54,9.76c5.27,0 9.54,-4.37 9.54,-9.76c0,-5.39 -4.27,-9.76 -9.54,-9.76l0,0z" id="svg_4"/>
     </g>
    </g>
   </svg>`;
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
