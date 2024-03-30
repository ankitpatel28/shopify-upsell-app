async function apiCall() {
  const proId = window.upsellParam.proId;
  await fetch(`${window.Shopify.routes.root}recommendations/products.json?product_id=${proId}&limit=15&intent=related`)
  .then(response => response.json())
  .then(({ products }) => {
    if (products.length > 0) {
      if(document.querySelector('div.page-width:has(> div.upsell_products-popup)')) {
        var mainDiv = document.querySelector('div.page-width:has(> div.upsell_products-popup)');
        mainDiv.classList.remove('animate--slide-in');
        mainDiv.classList.add('animate--slide-from-left');
      }
      const randomElement = products[Math.floor(Math.random() * products.length)];
      var product = randomElement;
      let html = '', img = '', moneySymbol = window.upsellParam.money;
      if(product.media) {
        img = `<img class="item-image" src="${product.media[0].src}" height="150" width="150" alt="${product.alt}">`;
      }
        html = `<span class="close-upsell_popup">x</span><div class="upsell_item">
                  <div class="left-image_section">${img}</div>
                  <div class="right-content_section">
                    <a href="/products/${product.handle}"><h3>${product.title}</h3></a>
                    <div class="price">
                      <span class="regular-price">${moneySymbol} ${parseFloat(product.price / 100).toFixed(2)}</span>
                    </div>
                    <div class="add-to_cart-form">
                      <form method="post" action="/cart/add" id="add-to-cart_${product.id}">
                        <input type="hidden" name="id" value="${product.id}" class="variant-id"/>
                        <div class="button_section">
                          <button type="submit" class="button button--primary"><span>Add to cart</span></button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>`;
      if(document.querySelector('.upsell_items')) document.querySelector('.upsell_items').innerHTML = html;
    }
  });
}
popup();
//apiCall();
async function popup() {
  let upsellClosed = getCookie("upsellPopClosed");
  if (upsellClosed != "") return;
  await apiCall();
  closePopup();
  if(document.querySelector('.animate--slide-from-right')){
    document.querySelector('.animate--slide-from-left').classList.remove('animate--slide-from-right');
  } 
  setTimeout(hidePopup, 5000);
}

function hidePopup() {
  if(document.querySelector('.animate--slide-from-left')){
    document.querySelector('.animate--slide-from-left').classList.add('animate--slide-from-right');
    document.querySelector('.animate--slide-from-left').classList.remove('animate--slide-from-left');
  }
  setTimeout(function(){document.querySelector('.upsell_items').innerHTML = '';}, 2500);
  setTimeout(popup, 5000);
}

function closePopup() {
  let closeElement = document.querySelector('.upsell-popup_main .close-upsell_popup');
  closeElement.addEventListener('click', function(event) {
    if(document.querySelector('.animate--slide-from-left')){
      document.querySelector('.animate--slide-from-left').classList.add('animate--slide-from-right');
      document.querySelector('.animate--slide-from-left').classList.remove('animate--slide-from-left');
    }
    setTimeout(function(){document.querySelector('.upsell_items').innerHTML = '';}, 1500);
    setCookie('upsellPopClosed', "userClickedToClose", 1);
  })
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}