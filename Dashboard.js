function getUserById(UserId){ 
var users = JSON.parse(localStorage.getItem('user')) || [];
var foundUser = users.find(function(user){
    return user.id === UserId;
});   
return foundUser;
}

var url = window.location.href;
var id = url.split(':')[3];
var user = getUserById(id);

$("#welcomeName").text("Hello, " + user.Name + ", Start your adventure Now!");

fetch('counties.json')
.then(function (response) {
  return response.json();
}).then(function (data) {
  appendData(data); 
}).catch(function (err) {
  console.log(err);
});

fetch('counties.json')
.then(function (response) {
  return response.json();
}).then(function (data) {
  appendData1(data);
}).catch(function (err) {
  console.log(err);
});

function appendData(data) { 
  var mainContainer = document.getElementById("MyData");
  for (var i = 0; i < data.length; i++) {
    
    var option = document.createElement("option");
    var countryCapital = data[i].Country + ', ' + data[i].city;
    option.value = countryCapital;
    option.setAttribute("long",data[i].Longitude);
    option.setAttribute("lat",data[i].latitude);
    option.textContent = countryCapital; 
    mainContainer.appendChild(option);
  }
}

function appendData1(data) {
  var mainContainer = document.getElementById("MyData2");
  for (var i = 0; i < data.length; i++) {
    var option = document.createElement("option");
    var countryCapital = data[i].Country + ', ' + data[i].city;
    option.value = countryCapital;
    option.setAttribute("long",data[i].Longitude);
    option.setAttribute("lat",data[i].latitude);
    option.textContent = countryCapital;
    mainContainer.appendChild(option);
  }

  const container = $('#Country');
  data.forEach(element => {
    let html = `
    <div class="Country">
      <h1>${element.Country}, ${element.city}</h1>
      <img src="${element.img}" alt="Image Description" width="200" height="150">
      <p>${element.Description}</p>
      <button onclick="window.open('https://www.google.com/maps/@${element.latitude},${element.Longitude},8z' , '_blank')" >View on Google Maps</button>
    </div>`;
    container.append(html);
  });  
}

function haversineDistance(coord1, coord2) {
  const R = 6371; // Radius of the Earth in kilometers

  // Convert latitude and longitude from degrees to radians
  const [lat1, lon1] = coord1.map((coord) => (coord * Math.PI) / 180);
  const [lat2, lon2] = coord2.map((coord) => (coord * Math.PI) / 180);

  // Differences in coordinates
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;
  return distance;
}

function deleteTicket(e) {
  if (!e.target.classList.contains('DeleteBtn')) {
    return;
  }
  const btn = e.target;
  btn.closest('.tickets').remove();
}


document.getElementById('formSub').addEventListener('submit', function(event) {
  event.preventDefault();
  let flag = true;
  var selectElementFROM = document.getElementById('MyData');
  var selectedOptionFROM = selectElementFROM.options[selectElementFROM.selectedIndex];
  var selectElementTo = document.getElementById('MyData2');
  var selectedOptionTo = selectElementTo.options[selectElementTo.selectedIndex];

  var CountryCapitalFrom = selectElementFROM.value;
  var CountryCapitalTo = selectElementTo.value;
  let numDays = $('#numDays').val();
  let numPass = $('#numPers').val();


  if(CountryCapitalFrom==='' || CountryCapitalTo==='' || numDays==='' || numPass==='' ){
    flag = false;
    $('#errMsg').text(`All Fields are Required`).css('color', 'red')
  }

  if(CountryCapitalFrom !=='' && CountryCapitalTo !=='' && numDays !=='' && numPass !==''){
  $('errMsg').text('');
  if(numDays<1 || numPass<1){
    flag = false;
    $('#errMsg').text(`Number of Days or Persons Must be greater then 0`);
  }
}



if(flag){

  var longitudeFROM = selectedOptionFROM.getAttribute('long');
  var latitudeFROM = selectedOptionFROM.getAttribute('lat');
  var longitudeTO = selectedOptionTo.getAttribute('long');
  var latitudeTO = selectedOptionTo.getAttribute('lat');

  let coordsFrom = [longitudeFROM, latitudeFROM];
  let coordsTo = [longitudeTO, latitudeTO];

  const distanceKm = parseInt(haversineDistance(coordsFrom, coordsTo));
  
  let price = parseInt(distanceKm/100) * (numDays + numPass)
  let html = `<div class="tickets">
  <div class="ticket-header">
    <h2 class="ticket-title">Flight Ticket</h2>
  </div>
  <div class="ticket-info">
    <p><strong>From:</strong> ${CountryCapitalFrom}</p>
    <p><strong>To:</strong> ${CountryCapitalTo}</p>
    <p><strong>Distance:</strong> ${distanceKm} km</p>
    <p><strong>Passengers:</strong> ${numPass}</p>
    <p><strong>Days:</strong> ${numDays}</p>
    <p><strong>Price:</strong> $${price}</p>
    <button class="DeleteBtn">Delete</button>
  </div>`;
  $('#ticketList').append(html);
  document.getElementById("MyData").value = "";
  document.getElementById("MyData2").value = "";
  document.getElementById("numDays").value = "";
  document.getElementById("numPers").value = "";
  
  document.querySelector('#ticketList').addEventListener('click',deleteTicket);
} 
});