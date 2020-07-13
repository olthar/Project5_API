let profileData;
let currentProfileData;

// ------------------------------------------
//  FETCH FUNCTION

async function getProfiles(url){
  const profileResponse = await fetch(url);
  const profilesJSON = await profileResponse.json();
  return profilesJSON
}

// ------------------------------------------

// Add modal element and hide it
const modalDiv = document.createElement("div");
modalDiv.style.display = "none";
document.querySelector("body").appendChild (modalDiv);

// Add search bar
function createSearch() {
  const search = document.createElement("form")
  search.action = "#";
  search.method = "get";
  search.innerHTML = `<input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">`
  document.querySelector(".search-container").appendChild (search);
  
  const searchInput = search.querySelector(".search-input");
  
  //Search names based on what is typed into search bar. 
  function searchNames(search, profiles,){
    const result = profiles.filter(profile => profile.name.first.toLowerCase() == search || profile.name.first.toLowerCase().includes(search));
    makeCard(result);
  }

  //Event listeners for search bar both when submitting and when typed into. 
  search.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = searchInput.value.toLowerCase()
    //If search is empty, the oringial cards will be created. Else cards will be created based on the searchNames function. 
    if (text == ""){
      makeCard(profileData);
   } else searchNames(text, profileData);
  });
  search.addEventListener("keyup", (e) => {
    e.preventDefault();
    const text = searchInput.value.toLowerCase()
    if (text == ""){
      makeCard(profileData);
   } else searchNames(text, profileData);
  });
}
createSearch();

//Funcation makes the gallery of cards from API and search data. 
function makeCard(data) {
  console.log(data)
  currentProfileData = data
  const profiles = data.map( function (profile,index) {
    return `<div class="card" id=${index}>
            <div class="card-img-container">
              <img class="card-img" src="${profile.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
            <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
            <p class="card-text">${profile.email}</p>
            <p class="card-text cap">${profile.location.city}, ${profile.location.state}</p>
            </div>
          </div>`;       
  });
  document.querySelector('.gallery').innerHTML = profiles.join(' ');
  let cards = document.querySelectorAll('.card');
  cards.forEach(item =>{
    item.addEventListener("click", e => {
      makeModal(parseInt(e.currentTarget.id));
    });
  });
}

// Create a modal card to display more of a persons data. 
function makeModal(indexPosition){
  const arrayLength = (currentProfileData.length)
  const profile = currentProfileData[indexPosition]
  const birthday = new Date(profile.dob.date);
  const modalCard = 
  `<div class="modal-container">
  <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
          <img class="modal-img" src="${profile.picture.large}" alt="profile picture">
          <h3 id="name" class="modal-name cap">${profile.name.first} ${profile.name.last}</h3>
          <p class="modal-text">${profile.email}</p>
          <p class="modal-text cap">${profile.location.city}</p>
          <hr>
          <p class="modal-text">${profile.phone}</p>
          <p class="modal-text">${profile.location.street.number} ${profile.location.street.name}, ${profile.location.city}, ${profile.location.state} ${profile.location.postcode} ${profile.location.country}</p>
          <p class="modal-text">Birthday: ${birthday.getMonth()+1}/${birthday.getDate()}/${birthday.getFullYear()}</p>
      </div>
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
  </div>`;
  modalDiv.innerHTML = modalCard;
  modalDiv.style.display = "";

  modalDiv.addEventListener("click", (e) => {
    if(e.target.className == "modal-close-btn" || e.target.tagName == "STRONG" ){
      modalDiv.style.display = "none";
    } 
  });

  //Event listeners for the scroll buttons on the modal window. Compensating for changing number of gallery profiles due to search. 
  modalDiv.addEventListener("click", (e) => {
    if(e.target.className == "modal-prev btn" ){
      if (indexPosition > 0){
          makeModal(indexPosition - 1);
        } else {
          makeModal(indexPosition + (arrayLength-1));
          
        }
    } else if (e.target.className == "modal-next btn" ){
      if (indexPosition < (arrayLength-1)){
      makeModal(indexPosition + 1);
      } else {
        makeModal(indexPosition - (arrayLength-1));
      }
    } 
})  ;
}

//Perform the fetch function
getProfiles('https://randomuser.me/api/?results=12&nat=gb,us')
    .then(data => profileData = data.results)
    .then(makeCard)
    .catch(error => console.log('Looks like there was a problem!', error))