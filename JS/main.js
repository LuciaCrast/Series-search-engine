let series = {
  name: "",
  image: "",
};
let seriesContainer = document.querySelector(".js-series");
let inputText = document.querySelector(".js-input");
let button = document.querySelector(".js-button");
let addToFavorites = document.querySelector(".js-favorites");
let apiResult = [];

//Función reusable para pintar la lista de series. Si tiene imagen que la pinte si no, que ponga la otra
// CAMBIAR INNER y esas cositas
function handlerPaint(array) {
  let content = "";
  array.forEach(function (serie) {
    if (serie.show.image) {
      content += `<li class="js-li list-element"> <img class="img"  src="${serie.show.image.medium}"> ${serie.show.name} </li>`;
    } else {
      content += `<li class="js-li list-element"> <img class="img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"> ${serie.show.name} </li>`;
    }
  });
  seriesContainer.innerHTML = `<ul> ${content}</ul>`;
  listenClickFavorites(); //aquí llamamos a listenClick (4)
}

//1) Si está en el Local Storage lo coge y lo mete en apiResult
if (localStorage.getItem("apiResult")) {
  apiResult = JSON.parse(localStorage.getItem("apiResult"));
}
//2) Función para coger el valor del input para extraer los objetos de la API, se lo pedimos a la API

function result() {
  fetch(`http://api.tvmaze.com/search/shows?q=${inputText.value}`)
    .then((response) => response.json())
    .then((data) => {
      handlerPaint(data);
      apiResult.push({
        searchValue: inputText.value,
        results: data,
      });
      localStorage.setItem("apiResult", JSON.stringify(apiResult)); //Si no estaba en caché lo añadimos
    });
}
//3) Función para comprobar si está en el caché o no. Llamamos a la que nos extrae el valor del input y la que nos pinta las cositas.
function comprobationCache(event) {
  event.preventDefault();
  let cachedResult = apiResult.find(
    (item) => item.searchValue === inputText.value
  );
  if (!cachedResult) {
    result();
  } else {
    handlerPaint(cachedResult.results); //  important el .result porque es un array de objetos, y si no da error
  }
}
//4)Función par seleccionar hacer click en las series
function listenClickFavorites() {
  const liElement = document.querySelectorAll(".js-li");
  for (let i = 0; i < liElement.length; i++) {
    liElement[i].addEventListener("click", handlerCheck);
  }
}
//Función para quitar y poner el fondo)
function handlerCheck(evt) {
  let clicked = evt.currentTarget;
  clicked.classList.toggle("list-element");
  clicked.classList.toggle("list-element2");
}

button.addEventListener("click", comprobationCache);