import {getEl} from './modules/dom-worker';


const form = getEl('form');
form.addEventListener('submit', logSubmit)

const numberInputEl = getEl('number')
const expMMInputEl = getEl('exp_mm')
const expYYInputEl = getEl('exp_yy')
const cvvInputEl = getEl('cvv')

function logSubmit(event) {
  event.preventDefault();

}
