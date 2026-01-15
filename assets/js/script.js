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
  
        let geocodingapi = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + lat +  "&lon=" + lon + "&limit=5appid=22d65c3f0942491b57830144d0824296*/";
        
        fetch(geocodingapi)
          .then((response) => {
              return response.json();
              })
          .then((data) => {   
              myArray = JSON.parse(data);
              return myArray;
              })
          .catch((err) => {
              // Do something for an error here
               }) ; 
  
        let location = myArray.name;
        document.getElementById("location").innerHTML = location; 
  
        return lat, lon;
}

getLocation();

function getConditions()
{
let conditions = {temperturee: 0, conditions: ' ', windspeed: 0, windDirection: '', humidity: 0, dewpoint: 0, ceiling: 0, visibility: ' ', pressure: 0};

const condition = "Humidity:" + conditions.humidity + "\n" 
+ "Dewpoint:" + conditions.dewpoint + "°" + "\n" 
+ "Ceiling:" + conditions.ceiling + "ft." + "\n" 
+ "Visibility:" + conditions.visibility + " " + "\n" 
+ "Pressure:" + conditions.pressure + "in." + "\n";  

document.getElementById("conditions").innerHTML = condition;  
}

getConditions();

let apicall = "https://api.openweathermap.org/data/2.5/weather?lat" + lat + "&lon=" + lon + "&appid=22d65c3f0942491b57830144d0824296";

fetch(apicall)
  .then((response) => {
    return response.json();
    })
  .then((data) => {
    // Work with JSON data here
    })
  .catch((err) => {
    // Do something for an error here
    }) ; 
