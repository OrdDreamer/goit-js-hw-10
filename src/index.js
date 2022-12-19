import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

function onInputChange(event) {
  event.preventDefault();
  clearView();

  const inputValue = searchInputElement.value.trim();
  if (!inputValue) {
    return;
  }

  fetchCountries(inputValue)
    .then((countries) => {
      if (countries.length === 1) {
        createCountryCard(countries);
        return;
      }
      if (countries.length <= 10) {
        createCountriesList(countries);
        return;
      }
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.',
      );
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCountriesList(countries) {
  listElement.innerHTML = countries
    .map(country => {
      return `
        <li class='country-list__item'>
          <img
            class='country-list__item-image'
            src='${country.flags.svg}'
            alt='Flag of ${country.name.official}'
            width='60' height='40'
          />
          <p class='country-list__item-name'>
            ${country.name.official}
          </p>
        </li>
      `;
    })
    .join(' ');
}

function createCountryCard(countries) {
  cardElement.innerHTML = countries
    .map(country => {
      return `<div class='flag-and-name'>
      <img
        src='${country.flags.svg}'
        alt='Flag of ${country.name.official}'
        width='60'
        height='40'
        class='flag-img'
      />
      <p class='country-name'>${country.name.official}</p>
    </div>
    <ul class='country-info-list'>
      <li class='country-info-item'>
        <p class='country-info-text'>Capital:&nbsp</p>
        <span class='country-info-span'>${country.capital}</span>
      </li>
      <li class='country-info-item'>
        <p class='country-info-text'>Population:&nbsp</p>
        <span class='country-info-span'>${country.population}</span>
      </li>
      <li class='country-info-item'>
        <p class='country-info-text'>Languages:&nbsp</p>
        <span class='country-info-span'>${Object.values(
        country.languages,
      )}</span>
      </li>
    </ul>`;
    })
    .join(' ');
}

function clearView() {
  listElement.innerHTML = '';
  cardElement.innerHTML = '';
}

const searchInputElement = document.querySelector('input#search-box');
const listElement = document.querySelector('ul.country-list');
const cardElement = document.querySelector('div.country-info');


searchInputElement?.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));