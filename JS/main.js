let favoriteSeries = [];
let totalSeries = [];
let apiResult = [];
let seriesContainer = document.querySelector(".js-series");
let inputText = document.querySelector(".js-input");
let button = document.querySelector(".js-button");
let favorites = document.querySelector(".js-favorites");

//1) Si está en el Local Storage lo coge y lo mete en apiResult. Si está en favoritos lo coge y lo pinta
if (localStorage.getItem("apiResult")) {
  apiResult = JSON.parse(localStorage.getItem("apiResult"));
}
if (localStorage.getItem("favoriteSeries")) {
  favoriteSeries = JSON.parse(localStorage.getItem("favoriteSeries"));
  paintFavorites();
  onClickDelete();
}

//2) Función para coger el valor del input para extraer los objetos de la API, se lo pedimos a la API

function result() {
  fetch(`//api.tvmaze.com/search/shows?q=${inputText.value}`)
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

//2a)FUNCIÓN PARA  Pushear los datos al array TOTALSERIES.
function pushSeriestoObject(serie) {
  if (serie.show.image) {
    totalSeries.push({
      name: `${serie.show.name}`,
      image: `${serie.show.image.medium}`,
    });
  } else {
    totalSeries.push({
      name: `${serie.show.name}`,
      image: `https://via.placeholder.com/210x295/ffffff/666666/?text=TV`,
    });
  }
}

// 2b)Función reusable para pintar la lista de series y ver si está marcada en favoritos.
function handlerPaint(array) {
  let content = "";
  totalSeries = [];
  array.forEach(function (serie) {
    let nameClass = "";
    let beFavorite = favoriteSeries.find((i) => i.name === serie.show.name);
    if (beFavorite) {
      nameClass = "list-element2";
    }
    if (serie.show.image) {
      content += `<li class="js-li list-element ${nameClass}"> <img class="img"  src="${serie.show.image.medium}"> <h3 class="seriename">${serie.show.name}</h3></li>`;
    } else {
      content += `<li class="js-li list-element ${nameClass}"> <img class="img" src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"> <h3 class="seriename">${serie.show.name}</h3> </li>`;
    }
    pushSeriestoObject(serie); //llamamos aquí a función(3b)
  });
  seriesContainer.innerHTML = `<ul class="listContainer"> ${content}</ul>`;
  listenClickFavorites(); //Llamamos aquí a la función (4)
}

//2d) Función para comprobar si está en el caché o no. Si la hemos buscado o no para no tirar se la API. Llamamos a la que nos extrae el valor del input y la que nos pinta las cositas.
function comprobationCache(event) {
  event.preventDefault();
  let cachedResult = apiResult.find(
    (item) => item.searchValue === inputText.value
  );
  if (!cachedResult) {
    result();
  } else {
    handlerPaint(cachedResult.results); //  important el .results porque es un array de objetos, y si no da error.
  }
}
//3)Función para seleccionar hacer click en las series.
//Aquí ponemos el evento a los li clicados
function listenClickFavorites() {
  const liElement = document.querySelectorAll(".js-li");
  for (let i = 0; i < liElement.length; i++) {
    liElement[i].addEventListener("click", function (event) {
      handlerCheckFavorites(event, i); // llamamos a nuestra función pitadora.Ponemos el parámetro i para llegar al indice en la función siquiente (3b)
    });
  }
}
//3a) Función para quitar y poner el fondo y añadir las series clicadas a la array de objetos favoritos
function handlerCheckFavorites(evt, i) {
  let clicked = evt.currentTarget;
  clicked.classList.toggle("list-element");
  clicked.classList.toggle("list-element2");
  saveSeriesNoRepeat(i);
  paintFavorites();
  onClickDelete();
}
//3b) Función para pintar favoritos le ponemos el partámetro "i" para que sepa a qué nos referimos.
function paintFavorites() {
  let content2 = "";
  for (let i = 0; i < favoriteSeries.length; i++) {
    content2 += `<li class="list-favorites js-favoriteli"> <button class="js-x buttonXstyle">X</button><img class="img"  src="${favoriteSeries[i].image}"> <h3 class="seriename">${favoriteSeries[i].name}</h3>   </li>`;
  }
  favorites.innerHTML = `<ul class="favoritesContent">${content2}</ul>`;
}

//4) Función para que no se repitan las series cuando las guardes. Y las metemos en el LS.
function saveSeriesNoRepeat(i) {
  let favoritesSeriesSaved = favoriteSeries.find(
    (item) => item.name === totalSeries[i].name
  );
  if (!favoritesSeriesSaved) {
    favoriteSeries.push({
      name: `${totalSeries[i].name}`,
      image: `${totalSeries[i].image} `,
    });
    localStorage.setItem("favoriteSeries", JSON.stringify(favoriteSeries));
  }
}

//5)Botón de Reset: Seleccionamos el botón de reset, le pasamos la array de favoritos vacía y borramos en el localStorage

function deleteAllButton() {
  let deleteAllButton = document.querySelector(".js-button-reset");
  deleteAllButton.addEventListener("click", function () {
    favoriteSeries = [];
    localStorage.removeItem("favoriteSeries");
    paintFavorites();
  });
}
deleteAllButton(); //Llamamos a la función.

//6 Botón de X a cada una de las series favoritas.
//Escuchamos el evento sobre los botones X

function onClickDelete() {
  let xButtons = document.querySelectorAll(".js-x");
  xButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      clicktoDeleteFav(index);
    });
  });
}
//6a) Buscamos el índice del objeto clicado y lo eliminamos de favoritos(y LS)
function deleteFavorite(index) {
  favoriteSeries.splice(index, 1);
  localStorage.setItem("favoriteSeries", JSON.stringify(favoriteSeries));
}

//Cuando borramos algo de favoritos, lo repintamos ya sin el descartado y llamamos de nuevo al evento de nuevo para que vuelva a funcionar.
function clicktoDeleteFav(index) {
  deleteFavorite(index);
  paintFavorites();
  onClickDelete();
}

button.addEventListener("click", comprobationCache);
//Todo va en un archivo para el autocompletado.
