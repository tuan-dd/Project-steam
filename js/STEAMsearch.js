const url = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com/";
const categoryList = document.getElementById("category-list");
const listGenres = document.querySelector("#list-genres");
const menuLogo = document.querySelector("#responsive_menu_logo");
const responsiveMenu = document.querySelector(".responsive_menu");
// const mediaMobile = window.matchMedia("(max-width: 350px)");
const mediaTable = window.matchMedia("(max-width: 600px)");
// const mediaLaptop = window.matchMedia("(max-width: 1000px)");
let querySelector = window.location.search.toLowerCase();
querySelector = querySelector.replaceAll("+", " ");
querySelector = querySelector.replaceAll("%20", " ");
// querySelector = querySelector.replace("%20", " ");
const main = document.querySelector("main");
const center = document.querySelector(".center");
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
// genresItem()
menuLogo.addEventListener("click", () => {
    if (listGenres.children.length < 2) {
        genresItem();
    }
    menuLogo.classList.toggle("none");
    responsiveMenu.classList.toggle("none");
});

listGenres.addEventListener("click", (e) => {
    const element = e.target;
    const genreText = `?genres=${element.textContent.trim()}`;
    if (mediaTable.matches) {
        limitNum = 0;
        categoryList.innerHTML = "";
        categoryItem(genreText, 10);
    } else {
        limitNum = 0;
        categoryList.innerHTML = "";
        categoryItem(genreText, 20);
    }
    // console.log(genreText);
});

// getCategoryList
const getCategoryList = async (genre, limit) => {
    try {
        if (limit > 0) {
            const response = await fetch(`${url}games${genre}&limit=${limit}`);
            const data = await response.json();
            const categoryItem = data.data;
            console.log(categoryItem);
            return categoryItem;
        } else if (!limit) {
            const response = await fetch(`${url}games${genre}&limit=20`);
            const data = await response.json();
            const categoryItem = data.data;
            console.log(categoryItem);
            return categoryItem;
        }
    } catch (err) {
        console.log("err", err);
    }
};
// getCategoryList('?q=dota 2', 10)
let categoryTitle = '';
let limitNum = 0;
const categoryItem = async (inform, limit) => {
    center.style.display = "flex";
    main.className = "none";
    let appid = 0;
    const categoryItem = await getCategoryList(inform, limit);
    if (!categoryItem) {
        console.log("err");
    }
    const categoryTitle = document.getElementById("category-title");
    if (inform.includes("?q=")) {
        categoryTitle.textContent = inform.slice(3);
    } else {
        categoryTitle.textContent = inform.slice(8);
    }
    center.style.display = "none";
    main.classList.remove("none");
    categoryItem.forEach((element) => {
        const item = document.createElement("figure");
        item.className = "item-game";
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
            categoryList.append(item);
        }
    });
    limitNum = categoryList.children.length;
    const itemGame = document.querySelectorAll(".item-game");
    itemGame.forEach((element) => {
        element.addEventListener("click", () => {
            categoryItem.forEach((item) => {
                if (item.name === element.children[1].children[0].textContent.trim()) {
                    appid = item.appid;
                }
            });
            window.location.href = `./STEAMdetail.html?q=${appid}`;
            // console.log(appid)
        });
    });
};
async function widthChangeCallback(mediaTable) {
    const categoryTitle = document.getElementById("category-title");
    let test = categoryTitle.textContent;
    if (!test) {
        await categoryItem(querySelector, limitNum)
    }
    if (arrayList.includes(test)) {
        test = `?genres=${categoryTitle.textContent.trim()}`;
    } else if (!arrayList.includes(test)) {
        test = `?q=${categoryTitle.textContent.trim()}`;
        // console.log(test);
    }
    if (mediaTable.matches && limitNum === 20) {
        limitNum = 10;
        categoryList.innerHTML = "";
        categoryItem(test, limitNum);
    }
    else if (!mediaTable.matches && limitNum === 10) {
        limitNum = 20;
        categoryList.innerHTML = "";
        categoryItem(test, limitNum);
    }
}
// mediaMobile.addEventListener('change', categoryItem)
mediaTable.addEventListener("change", widthChangeCallback);
// mediaMobile.addEventListener('change', widthChangeCallback)
widthChangeCallback(mediaTable);

//more
const more = document.querySelector(".more");
more.addEventListener("click", async () => {
    // await genresItem();
    limitNum += limitNum;
    // console.log(limitNum);
    const categoryTitle = document.getElementById("category-title");
    let test = categoryTitle.textContent;
    if (arrayList.includes(test)) {
        categoryList.innerHTML = "";
        test = `?genres=${categoryTitle.textContent.trim()}`;
        await categoryItem(test, limitNum);
    } else if (!arrayList.includes(test)) {
        categoryList.innerHTML = "";
        test = `?q=${categoryTitle.textContent.trim()}`;
        await categoryItem(test, limitNum);
        // console.log(test);
    }
});
// categoryItem(querySelector,limitNum)