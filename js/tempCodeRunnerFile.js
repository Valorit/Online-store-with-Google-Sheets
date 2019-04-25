$(document).ready(function () {
  $.getJSON

  ('https://spreadsheets.google.com/feeds/list/1zLzYpXl31A5qAGHIqOkp1K7y5NjwtqPZG5gXn8JpBJE/od6/public/values?alt=json',
    function (data) {
      console.log(data);
    });
});