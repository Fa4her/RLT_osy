
const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker;
let index;
let socket = io();

function updatePosition(position) {
  const { latitude, longitude } = position.coords;

  if (!marker) {
    marker = L.marker([latitude, longitude]).addTo(map);
    map.setView([latitude, longitude], 13);
  } else {
    marker.setLatLng([latitude, longitude]);
  }
  // 位置情報をサーバーに送信
  sendLocationToServer(latitude, longitude);
}

function sendLocationToServer(latitude, longitude) {
  const data = {"latitude": latitude, "longitude": longitude};
  socket.emit("send-location", data);

  // fetch('/save-location', {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  // })
  // .then(response => response.json())
  // .then(result => {
  //     console.log('位置情報がサーバーに送信されました:', result);
  // })
  // .catch(error => {
  //     console.error('位置情報の送信に失敗しました:', error);
  // });
}

function handleError(error) {
  console.error('位置情報の取得に失敗しました', error);
}

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(updatePosition, handleError, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 1000
  });
} else {
  alert('このブラウザでは位置情報がサポートされていません');
}

socket.emit("need-index", null);
socket.on("need-index", (index_)=>{
  index = index_;
  sessionStorage.setItem("index", index);
});