const basket = [];

function init() {
  getFromLocalStorage()
  renderFoodCards();
  renderBasket();
  showBasketAmount();
}

function renderFoodCards() {
  const menuCardsCakesSection = document.getElementById(
    "menuCardsCakesSection",
  );
  const menuCardsCheescakesSection = document.getElementById(
    "menuCardsCheescakesSection",
  );
  const menuCardsCupcakesSection = document.getElementById(
    "menuCardsCupcakesSection",
  );
  const menuCardsDonutsSection = document.getElementById(
    "menuCardsDonutsSection",
  );
  menuCardsCakesSection.innerHTML = "";
  menuCardsCheescakesSection.innerHTML = "";
  menuCardsCupcakesSection.innerHTML = "";
  menuCardsDonutsSection.innerHTML = "";

  for (let articleIndex = 0; articleIndex < articles.length; articleIndex++) {
    if (articles[articleIndex].category === "Burger") {
      menuCardsCakesSection.innerHTML += getFoodCardsHtml(articleIndex);
    }
    if (articles[articleIndex].category === "Beilagen") {
      menuCardsCheescakesSection.innerHTML += getFoodCardsHtml(articleIndex);
    }
    if (articles[articleIndex].category === "Dessert") {
      menuCardsDonutsSection.innerHTML += getFoodCardsHtml(articleIndex);
    }
  }
}

function renderBasket() {
  let subtotal = 0;
  const deliveryCosts = 5.0;

  const basketContent = document.getElementById("basketContent");
  const basketTotal = document.getElementById("basketTotal");
  basketContent.innerHTML = "";
  basketTotal.innerHTML = "";

  if (basket.length === 0) {
    basketContent.innerHTML += getEmptyBasketHtml();
    return;
  }

  for (
    let basketArticleIndex = 0;
    basketArticleIndex < basket.length;
    basketArticleIndex++
  ) {
    const article = basket[basketArticleIndex];
    subtotal += article.price * article.amount;

    basketContent.innerHTML += getBasketArticleCardHtml(
      article,
      basketArticleIndex,
    );
  }

  const finalTotal = subtotal + deliveryCosts;
  basketTotal.innerHTML += getBasketTotalSumSectionHtml(
    finalTotal,
    deliveryCosts,
    subtotal
  );
}

function addToBasket(articleIndex) {
  const article = articles[articleIndex];
  const button = document.getElementById(`btn${articleIndex}`);
  let existingArticle = null;

  for (
    let basketArticleIndex = 0;
    basketArticleIndex < basket.length;
    basketArticleIndex++
  ) {
    if (basket[basketArticleIndex].title === article.title) {
      existingArticle = basket[basketArticleIndex];
      break;
    }
  }

  if (existingArticle) {
    existingArticle.amount++;
  } else {
    basket.push({
      title: article.title,
      price: article.price,
      amount: 1,
    });
  }

  if (button) {
    const originalText = button.innerText;
    button.innerText = "Hinzugefügt";
    button.classList.add("pressed-button");
  
  setTimeout(function() {
      button.innerText = originalText;
      button.classList.remove("pressed-button");
    }, 800);
}
  renderBasket();
  showBasketAmount();
  saveToLocalStorage();
}

function changeAmount(basketArticleIndex, change) {
  basket[basketArticleIndex].amount += change;

  if (basket[basketArticleIndex].amount <= 0) {
    basket.splice(basketArticleIndex, 1);
  }

  renderBasket();
  showBasketAmount();
  saveToLocalStorage();
}

function deleteFromBasket(basketArticleIndex) {
  basket.splice(basketArticleIndex, 1);

  renderBasket();
  showBasketAmount();
  saveToLocalStorage();
}

function getAmountBasketArticles() {
  let amount = 0;

  for (
    let indexBasketArticle = 0;
    indexBasketArticle < basket.length;
    indexBasketArticle++
  ) {
    amount += basket[indexBasketArticle].amount;
  }
  return amount;
}

function showBasketAmount() {
  let totalAmount = getAmountBasketArticles();
  const amountBasket = document.getElementById("basketArtAmount");

  if (amountBasket) {
    amountBasket.innerText = totalAmount;
    amountBasket.classList.toggle("d-none", totalAmount === 0);
  }
}

function showMobileBasket(){
  const basketWrapper = document.getElementById("basketWrapper");
  basketWrapper.classList.toggle("basket-mobile");

  if (basketWrapper.classList.contains("basket-mobile")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

function saveToLocalStorage(){
  localStorage.setItem("basket", JSON.stringify(basket));
}

function getFromLocalStorage(){
  let savedBasket = localStorage.getItem("basket");

  if (savedBasket) {
    const data = JSON.parse(savedBasket);
    basket.length = 0;
    basket.push(...data);
  } else {
    saveToLocalStorage();
  }

  renderBasket();
}

function openDialog(){
  const dialogRef = document.getElementById("dialogMode");
  dialogRef.showModal();
  basket.length = 0;

  saveToLocalStorage();
  renderBasket();
  showBasketAmount();
}

function closeDialog(){
  const dialogRef = document.getElementById("dialogMode");
  dialogRef.close();
}

let rating = {
  value: 4.1,
  count: 317,
  liked: false,
};

function initRating() {
  const saved = localStorage.getItem("ratingState");
  if (saved) rating = JSON.parse(saved);
  renderRating();
}

function renderRating() {
  const star = document.getElementById("ratingStar");
  const countEl = document.getElementById("ratingCount");
  const box = document.getElementById("ratingBox");

  if (!star || !countEl || !box) return;

  countEl.innerText = rating.count;
  star.classList.toggle("star-active", rating.liked);
  box.setAttribute("aria-pressed", rating.liked ? "true" : "false");
}

function toggleRating() {
  if (rating.liked) {
    rating.count--;
    rating.liked = false;
  } else {
    rating.count++;
    rating.liked = true;
  }

  localStorage.setItem("ratingState", JSON.stringify(rating));
  renderRating();
}
