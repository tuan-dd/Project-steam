const url = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";
const Genres = "genres";
const features = "features";
// documents
const listGenres = document.querySelector("#list-genres");
const menuLogo = document.querySelector("#responsive_menu_logo");
const responsiveMenu = document.querySelector(".responsive_menu");
const categoryList = document.getElementById("category-list");
const bestGameList = document.getElementById("bestgame-list");
const main = document.querySelector("main");
const center = document.querySelector(".center");
const getListGenres = async () => {
  try {
    const response = await fetch(`${url}${Genres}`);
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
  });
};
// genresItem()
menuLogo.addEventListener("click", () => {
  if (listGenres.children.length < 2) {
    genresItem();
  }
  menuLogo.classList.toggle("none");
  responsiveMenu.classList.toggle("none");
});
// document.querySelector('.response').addEventListener('click',()=>{
//     responsiveMenu.classList.remove('none')
//     body.classList.remove('response')
// })

// FeaturesList
const getFeaturesList = async () => {
  try {
    const response = await fetch(`${url}${features}`);
    const data = await response.json();
    const featuresItem = data.data;
    // console.log(featuresItem)
    return featuresItem;
  } catch (err) {
    console.log("err", err);
  }
};
// getFeaturesList()
const mediaTable = window.matchMedia("(max-width: 600px)");
const featuresList = async () => {
  center.style.display = "flex";
  main.className = "none";

  const featuresItem = await getFeaturesList();
  if (!featuresItem) {
    console.log("error");
  }
  center.style.display = "none";
  main.classList.remove("none");
  featuresItem.map((element) => {
    const item = document.createElement("figure");
    item.className = "item-game best";
    // item.style.display = 'none';
    if (element.genres.includes("free to play")) {
      item.innerHTML = `
        <img
                src=${element.header_image}"
                alt="game"
              />
              <div>
                <p>${element.name}</p>
                <span>Free to play</span>
              </div>`;
      bestGameList.append(item);
    } else if (element.price > 0) {
      item.innerHTML = `
        <img
                src="${element.header_image}"
                alt="game"
              />
              <div>
                <p>${element.name}</p>
                <span>${element.price}</span>
              </div>`;
      bestGameList.append(item);
    } else if (element.price === 0) {
      item.innerHTML = `
        <img
                src="${element.header_image}"
                alt="game"
              />
              <div>
                <p>${element.name}</p>
                <span>Free</span>
              </div>`;
      bestGameList.append(item);
    }
  });
};
featuresList();

bestGameList.addEventListener("click", (e) => {
  const element = e.target;
  // let x = bestGameList.width()/10 +50;
  if (element.className === "material-symbols-outlined right") {
    bestGameList.scrollLeft += 450;
  } else if (element.className === "material-symbols-outlined left") {
    bestGameList.scrollLeft -= 450;
  }
  // console.log(element.className)
});

// categoryList

let genreText = "game";
listGenres.addEventListener("click", (e) => {
  const element = e.target;
  genreText = element.textContent.trim();
  if (mediaTable.matches) {
    categoryList.innerHTML = "";
    categoryItem(genreText, 6);
  } else {
    categoryList.innerHTML = "";
    categoryItem(genreText, 8);
  }
  // console.log(genreText);
});

const getCategoryList = async (genre, limit) => {
  try {
    if (genre === "game") {
      const response = await fetch(`${url}games?limit=${limit}`);
      const data = await response.json();
      const categoryItem = data.data;
      // console.log(categoryItem)
      return categoryItem;
    } else {
      const response = await fetch(`${url}games?genres=${genre}&limit=${limit}`);
      const data = await response.json();
      const categoryItem = data.data;
      // console.log(categoryItem)
      return categoryItem;
    }
  } catch (err) {
    console.log("err", err);
  }
};
let limitNum = 0;
const categoryItem = async (genres, limit) => {
  let appid = 0;
  const categoryTitle = document.getElementById("category-title");
  categoryTitle.textContent = genres;
  const categoryItem = await getCategoryList(genres, limit);
  if (!categoryItem) {
    console.log("err");
  }
  categoryItem.forEach((element) => {
    const item = document.createElement("figure");
    item.className = "item-game";
    if (
      element.steamspy_tags.includes("free to play") ||
      element.genres.includes("free to play")
    ) {
      item.innerHTML = `
            <img
            src=${element.header_image}"
            alt="game"
            />
            <div>
            <p>${element.name}</p>
            <span>Free to play</span>
            </div>`;
      categoryList.appendChild(item);
    } else if (element.price === 0) {
      item.innerHTML = `
            <img
            src=${element.header_image}"
            alt="game"
            />
            <div>
            <p>${element.name}</p>
            <span>free</span>
            </div>`;
      categoryList.appendChild(item);
    } else if (element.price > 0) {
      item.innerHTML = `
        <img
                src="${element.header_image}"
                alt="game"
              />
              <div>
                <p>${element.name}</p>
                <span>${element.price}</span>
              </div>`;
      categoryList.appendChild(item);
    }
  });
  limitNum = categoryList.children.length;
  // console.log(listGame.children)
  const itemGame = document.querySelectorAll(".item-game");
  itemGame.forEach((item) => {
    item.addEventListener("click", () => {
      categoryItem.forEach((element) => {
        if (element.name === item.children[1].children[0].textContent.trim()) {
          appid = element.appid;
        }
      });
      window.location.href = `./STEAMdetail.html?q=${appid}`;
      // console.log(appid)
    });
  });

  // window.location = './STEAMdetail.html'
};

function widthChangeCallback(mediaTable) {
  if (mediaTable.matches && limitNum > 8) {
    categoryList.innerHTML = "";
    categoryItem(genreText, limitNum);
  } else if (mediaTable.matches && limitNum === 0) {
    categoryList.innerHTML = "";
    categoryItem(genreText, 6);
  } else if (mediaTable.matches && limitNum === 8) {
    categoryList.innerHTML = "";
    categoryItem(genreText, 6);
  }else if (!mediaTable.matches && limitNum > 6) {
    categoryList.innerHTML = "";
    categoryItem(genreText, limitNum);
  } else if (!mediaTable.matches && limitNum === 0) {
    categoryList.innerHTML = "";
    categoryItem(genreText, 8);
  } else if (!mediaTable.matches && limitNum === 6) {
    categoryList.innerHTML = "";
    categoryItem(genreText, 8);
  }
}
mediaTable.addEventListener("change", widthChangeCallback);
widthChangeCallback(mediaTable);

// more

const more = document.querySelector(".more");
more.addEventListener("click", async () => {
  // await genresItem();
  limitNum += limitNum;
  // console.log(limitNum)
  categoryList.innerHTML = "";

  await categoryItem(genreText, limitNum);
});