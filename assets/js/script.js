function currentDate() 
{
  let date = new Date();
  let ddd = date.getDay();
  let mmm = date.getMonth();
  let dd = date.getDate();
  
  switch (date.getDay()) 
  {
  case 0:
    ddd = "SUN";
    break;
  case 1:
    ddd = "MON";
    break;
  case 2:
    ddd = "TUE";
    break;
  case 3:
    ddd = "WED";
    break;
  case 4:
    ddd = "THU";
    break;
  case 5:
    ddd = "FRI";
    break;
  case 6:
    ddd = "SAT";
  }
  
  switch (date.getMonth()) 
  {
  case 0:
    mmm = "JAN";
    break;
  case 1:
    mmm = "FEB";
    break;
  case 2:
    mmm = "MAR";
    break;
  case 3:
    mmm = "APR";
    break;
  case 4:
    mmm = "MAY";
    break;
  case 5:
    mmm = "JUN";
    break;
  case 6:
    mmm = "JUL";
    break;
  case 7:
    mmm = "AUG";
    break;
  case 8:
    mmm = "SEP";
    break;
  case 9:
    mmm = "OCT";
    break;
  case 10:
    mmm = "NOV";
    break;
  case 11:
    mmm = "DEC";
  }
  
  let day = ddd + " " + mmm + " " + dd;
 
  document.getElementById("calendar").innerHTML = day;
}

function currentTime() {
  let date = new Date(); 
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  let session = "AM";

  if(hh == 0)
    {
        hh = 12;
    }
  if(hh > 12)
    {
        hh = hh - 12;
        session = "PM";
    }

   hh = (hh < 10) ? "0" + hh : hh;
   mm = (mm < 10) ? "0" + mm : mm;
   ss = (ss < 10) ? "0" + ss : ss;
    
   let time = hh + ":" + mm + ":" + ss + " " + session;

  document.getElementById("clockone").innerHTML = time; 
}
currentDate(); 
currentTime();

function getLocation() 
{
    if(!navigator.geolocation)      
    {
        const location = "Geolocation not supported by browser.";
        
        document.getElementById("location").innerHTML = location;
     }
     else 
     {
       navigator.geolocation.getCurrentPosition(showPosition);  
     }    
} 

function showPosition(position)
{
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
  
        let geocodingapi = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat +  "&lon=" + lon + "&limit=5&appid=22d65c3f0942491b57830144d0824296";
        
        fetch(geocodingapi)
          .then((response) => response.json())
          .then((data) => {          
              document.getElementById("location").innerHTML = data[0].name; 
              
              getConditions(lat, lon);
              })
          .catch((err) => console.error("Location error:", err));
          
          getConditions(lat, lon);
}

function getConditions(lat, lon)
{
    let apicall = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=22d65c3f0942491b57830144d0824296`;

    fetch(apicall)
    .then((response) => response.json())
    .then((data) => {
    
	
	//conditions on the left side of the screen
    let temp = Math.round(data.main.temp);
    let sky = data.weather[0].description;
	let windspeed = data.wind.speed;
	let windDir = getCardinalDirection(data.wind.deg);
    
	//conditions on the right side of the screen
	let  hum = data.main.humidity;
    let dewpoint = 0;
    let ceiling = 0;
    let visibility =  data.visibility; 
    let press= data.main.pressure;
   
    document.getElementById("conditions_right").innerHTML = `${temp}°F <p>
	${sky} <p>
	Wind: ${windspeed} ${windDir}`   
	
    document.getElementById("conditions_left").innerHTML= `Humidity:${hum}% <p>
	Pressure: ${press} inHg <p>
	Visibility: ${visibility} mi`
    })
    .catch((err) => console.error("Weather error:", err));
}

function getCardinalDirection(angle) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(angle / 45) % 8];
}

getLocation();
setInterval(currentTime, 1000);
