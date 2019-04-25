/* jshint esversion: 6 */

window.onload = function () {
  //send request
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
  getJSON('https://spreadsheets.google.com/feeds/list/1PLFK9plxisuuTx8pxlvQzgjapmINrlemgCfGnH2Wlo8/od6/public/values?alt=json', function (err, data) {
    console.log(data);
    if (err !== null) {
      console.log('Error: ' + err);
    } else {
      data = data['feed']['entry'];
      console.log(data);
      document.querySelector('.shop-field').innerHTML = showGoods(data);
    }
  });

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
        out += `<p class="cost"><button type="button" class="btn btn-success" data="${data[i]['gsx$id']['$t']}">Buy</button></p>`;
        out += `</div>`;
        out += `</div>`;
      }
    }
    return out;
  }
};