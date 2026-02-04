let basket = [];
let isRated = false;

const CATEGORY_TARGETS = {
  Burger: "menuCardsBurgerSection",
  Beilagen: "menuCardsBeilagenSection",
  Dessert: "menuCardsDessertSection",
};

function renderNotes() {
  renderAllMenus();
  renderBasket();
  syncDeliveryFeeToUI();
  updateOrderbar();
}

function formatPrice(num) {
  return num.toFixed(2).replace(".", ",") + "€";
}

function renderAllMenus() {
  if (!Array.isArray(articles)) {
    console.error("articles fehlt (datenbank.js prüfen)");
    return;
  }

  for (const category in CATEGORY_TARGETS) {
    const targetId = CATEGORY_TARGETS[category];
    const targetEl = document.getElementById(targetId);
    if (!targetEl) continue;

    targetEl.innerHTML = "";

    for (let i = 0; i < articles.length; i++) {
      if (articles[i].category === category) {
        targetEl.innerHTML += getFoodCardsHtml(i);
      }
    }
  }
}

function addToBasket(articleIndex) {
  const item = articles[articleIndex];
  if (!item) return;

  const existingIndex = basket.findIndex((b) => b.title === item.title);

  if (existingIndex > -1) {
    basket[existingIndex].amount += 1;
  } else {
    basket.push({
      title: item.title,
      price: item.price,
      amount: 1,
    });
  }

  renderBasket();
}

function renderBasket() {
  const contentEl = document.getElementById("basketContent");
  const totalEl = document.getElementById("basketTotal");

  if (!contentEl || !totalEl) return;

  contentEl.innerHTML = "";
  totalEl.innerHTML = "";

  if (basket.length === 0) {
    contentEl.innerHTML = getEmptyBasketHtml();
    updateOrderbar();
    return;
  }

  for (let i = 0; i < basket.length; i++) {
    contentEl.innerHTML += getBasketArticleCardHtml(basket[i], i);
  }

  let subtotal = 0;
  for (let i = 0; i < basket.length; i++) {
    subtotal += basket[i].price * basket[i].amount;
  }

  const deliveryCosts = typeof deliveryFee === "number" ? deliveryFee : 0;
  const finalTotal = subtotal + deliveryCosts;

  totalEl.innerHTML = getBasketTotalSumSectionHtml(finalTotal, deliveryCosts, subtotal);

  updateOrderbar();
}

function changeAmount(basketArticleIndex, delta) {
  const item = basket[basketArticleIndex];
  if (!item) return;

  item.amount += delta;

  if (item.amount <= 0) {
    basket.splice(basketArticleIndex, 1);
  }

  renderBasket();
}

function deleteFromBasket(basketArticleIndex) {
  basket.splice(basketArticleIndex, 1);
  renderBasket();
}

function showMobileBasket() {
  const wrapper = document.getElementById("basketWrapper");
  if (!wrapper) return;
  wrapper.classList.toggle("basket-mobile");
}

function openDialog() {
  const dialog = document.getElementById("dialogMode");
  if (!dialog) return;

  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "true");
}

function closeDialog() {
  const dialog = document.getElementById("dialogMode");
  if (!dialog) return;

  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");

  basket = [];
  renderBasket();
}

function toggleRating() {
  const ratingBox = document.getElementById("ratingBox");
  const ratingStar = document.getElementById("ratingStar");
  const ratingCount = document.getElementById("ratingCount");

  if (!ratingBox || !ratingStar || !ratingCount) return;

  let count = parseInt((ratingCount.textContent || "0").replace(/\D/g, ""), 10);
  if (Number.isNaN(count)) count = 0;

  isRated = !isRated;

  if (isRated) {
    count += 1;
    ratingBox.setAttribute("aria-pressed", "true");
    ratingStar.style.filter = "saturate(2) brightness(1.15)";
  } else {
    count = Math.max(0, count - 1);
    ratingBox.setAttribute("aria-pressed", "false");
    ratingStar.style.filter = "none";
  }

  ratingCount.textContent = String(count);
}

function scrollToMenu() {
  const target = document.querySelector(".catnav") || document.getElementById("cat-burger");
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateOrderbar() {
  const totalEl = document.getElementById("orderbarTotal");
  const badgeEl = document.getElementById("orderbarBadge");

  if (!totalEl || !badgeEl) return;

  let total = 0;
  let amount = 0;

  for (let i = 0; i < basket.length; i++) {
    total += basket[i].price * basket[i].amount;
    amount += basket[i].amount;
  }

  const deliveryCosts = typeof deliveryFee === "number" ? deliveryFee : 0;
  const grandTotal = amount > 0 ? total + deliveryCosts : 0;

  totalEl.textContent = formatPrice(grandTotal);

  if (amount > 0) {
    badgeEl.classList.remove("d-none");
    badgeEl.textContent = String(amount);
  } else {
    badgeEl.classList.add("d-none");
    badgeEl.textContent = "0";
  }
}

function syncDeliveryFeeToUI() {
  const feeEl = document.getElementById("deliveryFeeValue");
  if (!feeEl) return;

  const fee = typeof deliveryFee === "number" ? deliveryFee : 0;
  feeEl.textContent = formatPrice(fee);
}

function openAccountModal() {
  const modal = document.getElementById("accountModal");
  if (!modal) return;

  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "true");
}

function closeAccountModal() {
  const modal = document.getElementById("accountModal");
  if (!modal) return;

  if (typeof modal.close === "function") modal.close();
  else modal.removeAttribute("open");
}