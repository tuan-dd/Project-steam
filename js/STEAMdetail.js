const url = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";
const categoryList = document.getElementById("category-list");
const listGenres = document.querySelector("#list-genres");
const menuLogo = document.querySelector("#responsive_menu_logo");
const responsiveMenu = document.querySelector(".responsive_menu");
// const mediaMobile = window.matchMedia("(max-width: 350px)");
const mediaTable = window.matchMedia("(max-width: 600px)");
// const mediaLaptop = window.matchMedia("(max-width: 1000px)");
const container = document.querySelector(".container");
let querySelector = window.location.search.toLowerCase();
querySelector = querySelector.replace("%20", " ");
const main = document.querySelector("main");
const center = document.querySelector(".center");

// console.log(querySelector);

// genresItem()
let arrayList = [];
const getListGenres = async () => {
  try {
    const response = await fetch(`${url}genres`);
    const data = await response.json();
    const genresItem = data.data;
    // console.log(genresItem)
    return genresItem;
  } catch (err) {
    console.log("err", err);
  }
};

const genresItem = async () => {
  const genresItem = await getListGenres();
  if (!genresItem) {
    console.log("error");
  }
  genresItem.forEach((element) => {
    const item = document.createElement("li");
    item.className = "item";
    item.innerHTML = `
        <button type="submit" class="btn genre">
        ${element["name"]}
        </button>`;
    listGenres.appendChild(item);
    arrayList.push(element["name"]);
  });
};
menuLogo.addEventListener("click", () => {
  if (listGenres.children.length < 2) {
    genresItem();
  }
  menuLogo.classList.toggle("none");
  responsiveMenu.classList.toggle("none");
});

listGenres.addEventListener("click", (e) => {
  const element = e.target;
  const genreText = element.textContent.trim();
  window.location.href = `./STEAMsearch.html?genres=${genreText}`;
});

// detail
const getDetail = async (querySelector) => {
  try {
    const response = await fetch(`${url}single-game/${querySelector}`);
    const data = await response.json();
    const detail = data.data;
    console.log(detail);
    return detail;
  } catch (err) {
    console.log("err", err);
  }
};
// getCategoryList('?q=dota 2', 10)
const detailInfo = async () => {
  center.style.display = "flex";
  main.className = "none";
  const categoryTitle = document.getElementById("category-title");
  const categoryItem = await getDetail(querySelector.slice(3));
  center.style.display = "none";
  main.classList.remove("none");
  categoryTitle.textContent = categoryItem.name;
  if (!categoryItem) {
    console.log("err");
  }
  const categories = categoryItem.categories.map(
    (element) =>
      (element = `<a class="tags" href="https://store.steampowered.com/"
    >${element}</a>`)
  );
  const item = document.createElement("figure");
  item.className = "game-detail";
  item.innerHTML = `<img
            src="${categoryItem.header_image}"
            alt="game"
          />
          <div class="info">
            <div class="description">
              <p>
              ${categoryItem.description}
              </p>
            </div>
            <div class="detail-info">
              <p class="positive_ratings">Positive ratings :${
                categoryItem.positive_ratings
              }</p>
              <p class="negative_ratings">Negative ratings:${
                categoryItem.negative_ratings
              }</p>
              <p class="average_playtime">Average playtime :${
                categoryItem.average_playtime
              }</p>
              <p class="release_date">release_date: 23.9.2022</p>
            </div>
            <div>
              <p class="steamspy_tags">Geners:<span>${categoryItem.steamspy_tags.join(
                " - "
              )}</span></p>
            </div>
            <div class="categories">
              <p>Popular user-defined tags for this product:${categories.toString()}</p>
            </div>
          </div>`;
  container.style.background = `url(${categoryItem.background})`;
  categoryList.appendChild(item);
};
detailInfo();
