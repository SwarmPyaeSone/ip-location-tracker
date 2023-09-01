//get data from api
async function getAPIData(ipAddress = '') {
    
    const API_URL = 'https://ipwho.is/';

    const response = await fetch(`${API_URL}${ipAddress}`);
    const results = await response.json();
    console.log(results);
    return results;
};

const map = L.map('map');
map.setView([0, 0], 2);

function displayLeafletMap(data) {
    
    map.setView([data.latitude, data.longitude], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
        
        L.circle([data.latitude, data.longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 1000
        }).addTo(map);
}

async function displayOnMapByCurrentIP() {
    const results = await getAPIData();
    displayOnMap(results);
}

async function displayOnMap(data) {
    const ipAddress = document.querySelector('.data-ip');
    const city = document.querySelector('.data-city');
    const timezone = document.querySelector('.data-timezone');
    const isp = document.querySelector('.data-isp');

    ipAddress.textContent = data.ip;
    city.textContent = `${data.city}, ${data.region_code} ${data.postal}`;
    timezone.textContent = `UTC ${data.timezone.utc}`;
    isp.textContent = data.connection.isp;

    displayLeafletMap(data);
}

async function searchByIP(e) {
    e.preventDefault();
    
    const ipAddress = document.querySelector('input').value;
    if(ipAddress !== '') {
        const searchResults = await getAPIData(ipAddress);
        if(searchResults.success == true) {
            displayOnMap(searchResults);
        } else {
            alert('Location with this IP Address is not found!')
            return;
        }
    } else {
        alert('Enter a valid ip address!');
        return;
    }
}



const form = document.querySelector('form');
form.addEventListener('submit', searchByIP);
document.addEventListener('DOMContentLoaded', displayOnMapByCurrentIP);