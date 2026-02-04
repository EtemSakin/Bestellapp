function getFoodCardsHtml(articleIndex) {
  const a = articles[articleIndex];

  return `
    <div class="food-card hover-lift">
      <img class="food-card-img" src="${a.img}" alt="${a.title}">
      
      <div class="food-card-info">
        <div class="food-card-title-with-description">
          <h3 class="food-card-title">${a.title}</h3>
          <p class="description">${a.description}</p>
        </div>

        <div class="food-card-buttons">
          <p class="price">${formatPrice(a.price)}</p>
          <button id="btn${articleIndex}" class="add-to-basket-button hover-lift" onclick="addToBasket(${articleIndex})">
            Hinzufügen
          </button>
        </div>
      </div>
    </div>
  `;
}

function getEmptyBasketHtml() {
  return `
    <div class="basket-empty">
      <p class="empty-basket">Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</p>
      <img class="basket-empty-img" src="./assets/icons/einkaufswagen.png" alt="leerer Einkaufswagen">
    </div>
  `;
}

function getBasketArticleCardHtml(article, basketArticleIndex) {
  const subtotal = article.price * article.amount;

  return `
    <div class="basket-articles">
      <div class="basket-row">
        <div class="basket-title"><b>${article.title}</b></div>
        <div class="basket-subtotal">${formatPrice(subtotal)}</div>
      </div>

      <div class="basket-row">
        <div class="buttons">
          <button class="small-basket-button hover-lift" onclick="changeAmount(${basketArticleIndex}, -1)" aria-label="Menge reduzieren">-</button>
          <span class="amount-display" aria-label="Menge">${article.amount}</span>
          <button class="small-basket-button hover-lift" onclick="changeAmount(${basketArticleIndex}, +1)" aria-label="Menge erhöhen">+</button>
        </div>

        <button class="trash-btn hover-lift" onclick="deleteFromBasket(${basketArticleIndex})" aria-label="Artikel löschen">
          <img src="./assets/icons/mulleimer.png" alt="löschen">
        </button>
      </div>
    </div>
  `;
}

function getBasketTotalSumSectionHtml(finalTotal, deliveryCosts, subtotal) {
  return `
    <div class="cost">
      <div class="cost-category">
        <span>Zwischensumme:</span>
        <span>${formatPrice(subtotal)}</span>
      </div>

      <div class="cost-category">
        <span>Lieferungskosten:</span>
        <span>${formatPrice(deliveryCosts)}</span>
      </div>
    </div>

    <hr>

    <div class="total-cost">
      <strong>Gesamtsumme:</strong>
      <strong>${formatPrice(finalTotal)}</strong>
    </div>

    <button class="buy-button hover-lift" id="buyButton" onclick="openDialog()">
      Bestellen
    </button>
  `;
}