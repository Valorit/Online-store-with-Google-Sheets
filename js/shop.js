/* jshint esversion: 6 */

window.onload = function () { //запускать скрипт при загруженной странице
  //пустой ассоциативный массив
  let cart = {};
  let goods = {};

  //загрузка корзины из localStorage
  function loadCartFromStorage() {
    if (localStorage.getItem('cart') != undefined) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
  }



  //запрос на получение данных из google sheets
  let getJSON = function (URL, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      let status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
  };
  getJSON('https://spreadsheets.google.com/feeds/list/1PSb6iTa0DoimmECVgfRUUSMefN-RbhvAgnxrDDoBsfA/od6/public/values?alt=json', function (err, data) {
    console.log(data);
    if (err !== null) {
      console.log('Error: ' + err);
    } else {
      data = data['feed']['entry'];
      console.log(data);
      goods = arrayHelper(data);
      console.log(goods);
      document.querySelector('.shop-field').innerHTML = showGoods(data);
      showCart();
    }
  });

  //отображение товаров на странице
  function showGoods(data) {
    let out = '';
    for (var i = 0; i < data.length; i++) {
      if (data[i]['gsx$show']['$t'] != 0) {
        out += `<div class="col-lg-3 col-md-3 col-sm-2 text-center">`;
        out += `<div class="goods">`;
        out += `<h5>${data[i]['gsx$name']['$t']}</h5>`;
        out += `<img src="${data[i]['gsx$image']['$t']}" alt="">`;
        out += `<p class="cost">Price: ${data[i]['gsx$cost']['$t']}$</p>`;
        out += `<p class="cost">Is available: ${data[i]['gsx$kg']['$t']}kg</p>`;
        out += `<p class="cost"><button type="button" class="btn btn-success" name="add-to-cart" data="${data[i]['gsx$id']['$t']}">Buy</button></p>`;
        out += `</div>`;
        out += `</div>`;
      }
    }
    return out;
  }

  //событие с таргетом на кнопку Buy + - Delete
  document.onclick = function (e) {
    if (e.target.attributes.name != undefined) {
      if (e.target.attributes.name.nodeValue == 'add-to-cart') {
        addToCart(e.target.attributes.data.nodeValue);
      } else if (
        e.target.attributes.name.nodeValue == 'delete-goods'
      ) {
        delete cart[e.target.attributes.data.nodeValue];
        localStorage.setItem('cart', JSON.stringify(cart));
        showCart();
      } else if (
        e.target.attributes.name.nodeValue == 'plus-goods'
      ) {
        cart[e.target.attributes.data.nodeValue]++;
        localStorage.setItem('cart', JSON.stringify(cart));
        showCart();
      } else if (
        e.target.attributes.name.nodeValue == 'minus-goods'
      ) {
        if (cart[e.target.attributes.data.nodeValue] > 1) {
          cart[e.target.attributes.data.nodeValue]--;
        } else {
          delete cart[e.target.attributes.data.nodeValue];
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        showCart();
      } else if (
        e.target.attributes.name.nodeValue == 'buy'
      ) {
        let data = {
          name: document.getElementById('customer-name').value,
          email: document.getElementById('customer-email').value,
          phone: document.getElementById('customer-phone').value,
          cart: cart
        };

        fetch("php_mail/mail.php", {
            method: "POST",
            body: JSON.stringify(data)
          })
          .then(function (res) {
            console.log(res);
            if (res) {
              alert('Your order has been sent');
            } else {
              alert('Order error');
            }
          });
      }
    }
    return false;
  };

  //колличество добавленных элементов в корзине
  function addToCart(elem) {
    if (cart[elem] !== undefined) {
      cart[elem]++;
    } else {
      cart[elem] = 1;
    }
    console.log(cart);
    showCart();
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  //описание добавленных элементов в корзине
  function arrayHelper(arr) {
    let out = {};
    for (let i = 0; i < arr.length; i++) {
      let temp = {};
      temp['articul'] = arr[i]['gsx$articul']['$t'];
      temp['name'] = arr[i]['gsx$name']['$t'];
      temp['category'] = arr[i]['gsx$category']['$t'];
      temp['cost'] = arr[i]['gsx$cost']['$t'];
      temp['image'] = arr[i]['gsx$image']['$t'];
      out[arr[i]['gsx$id']['$t']] = temp;
    }
    return out;
  }

  //отображение корзины в виде списка
  function showCart() {
    let ul = document.querySelector('.cart');
    ul.innerHTML = '';
    let sum = 0;
    for (let key in cart) {
      let li = '<li>';
      li += goods[key]['name'] + ' ';
      li += `<button name="minus-goods" data='${key}'>-</button>`
      li += cart[key] + 'kg ';
      li += `<button name="plus-goods" data='${key}'>+</button>`
      li += '$' + goods[key]['cost'] * cart[key];
      li += `<button name="delete-goods" data='${key}'>Delete</button>`
      li += '</li>';
      sum += goods[key]['cost'] * cart[key];
      ul.innerHTML += li;
    }
    ul.innerHTML += 'Subtotal: $' + sum;
  }
};