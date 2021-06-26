//Initialise empty array to eventually fill with filtered user objects
let filteredProfiles = [];

//Function to generate a profile card
const generateProfile = profileData => {
    const gallery = document.querySelector('.gallery');
    // Empty gallery div so cards aren't infinitely added each time function gets called.
    gallery.innerHTML = '';

    //iterate over data creating custom profile cards for each user object
    for(let i = 0; i < profileData.length; i++){
        gallery.innerHTML += 
        `<div class="card" id="${i}">
            <div class="card-img-container">
                <img class="card-img" src="${profileData[i].picture.thumbnail}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${profileData[i].name.first} ${profileData[i].name.last}</h3>
                <p class="card-text">${profileData[i].email}</p>
                <p class="card-text cap">${profileData[i].location.city}, ${profileData[i].location.state}</p>
            </div>
        </div>`
    }
//add click listener to each profile card, display corresponding modal window for selected profile
let profiles = document.querySelectorAll('.card');
    profiles.forEach(profile => {
        profile.addEventListener('click', (e) => {
            displayModal(parseInt(e.currentTarget.id), profileData);
        })
    })
}

// This function will format the phone number (XXX) XXX-XXXX
function formatPhoneNumber(phoneNumber) {
    const phoneRegEx1 = /(\d{3})/gm
    const phoneRegEx2 = /(\d{4})/gm
    const firstHalfPhoneNumber = phoneNumber.match(phoneRegEx1)
    const secondHalfPhoneNumber = phoneNumber.match(phoneRegEx2)
    return `(${ firstHalfPhoneNumber[0]}) ${ firstHalfPhoneNumber[1] }-${ secondHalfPhoneNumber[0] }`
  }
  

// This function will format the birthday MM/DD/YYYY
function formatBirthday(dob) {
    const dobRegex = /\d{4}-\d{2}-\d{2}/gm
    dob = dob.match(dobRegex)
    const year = dob[0].split('-')[0]
    const month = dob[0].split('-')[1]
    const day = dob[0].split('-')[2]
    return `${ month }/${ day }/${ year }`
  }
  
// Function to make modal window
const displayModal = (profileIndex, data) => {
    let modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.style.backgroundColor = generateRandomColor();
    modalContainer.innerHTML = 
        `<div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${data[profileIndex].picture.thumbnail}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${data[profileIndex].name.first} ${data[profileIndex].name.last}</h3>
                <p class="modal-text">${data[profileIndex].email}</p>
                <p class="modal-text cap">${data[profileIndex].location.city}</p>
                <hr>
                <p class="modal-text"> ${ formatPhoneNumber(data[profileIndex].cell)}</p>
                <p class="modal-text">${data[profileIndex].location.street.number}, ${data[profileIndex].location.street.name}, ${data[profileIndex].location.state}, ${data[profileIndex].location.postcode}</p>
                <p class="modal-text">Birthday: ${ formatBirthday(data[profileIndex].dob.date.substring(0,10))}</p>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>`

    document.querySelector('body').appendChild(modalContainer);

    // Remove modal window when 'X' button is clicked.
    document.querySelector('.modal-close-btn').addEventListener('click', () => {
        document.querySelector('body').removeChild(document.querySelector('.modal-container'));
    })

    // Target 'Next' and 'Prev' buttons on modal window.
    const buttons = document.querySelectorAll('.modal-btn-container button');

    /*
        Hide or display buttons depending on index of profile. 
        Eg. If first profile is selected, 'Prev' button is hidden.
        If last profile is selected, 'Next' button is hidden.
        If only one profile is displayed, no buttons are visible.
    */
    addOrRemoveButtons(profileIndex, data, buttons);

    // Click listener for each button, displays either next or previous modal window.
    buttons.forEach(button => {
        button.addEventListener('click', e => {
            addOrRemoveButtons(profileIndex, data, buttons);

            document.querySelector('body').removeChild(modalContainer);
            if(e.target.textContent === 'Next'){
                displayModal(profileIndex + 1, data);
            } else if (e.target.textContent === 'Prev'){
                displayModal(profileIndex - 1, data);
            }
        })
    })
}

// Function to filter profiles depending on search bar value.
const filterProfiles = (searchInput, data) => {

    // Empty existing filtered array.
    filteredProfiles = [];

    // If a modal window exists, remove it.
    if(document.querySelector('.modal-container')){
        document.querySelector('body').removeChild('.modal-container');
    }
    
    // Filtering process, pushes matching profiles to filteredProfiles array.
    data.forEach(profile => {
        if (profile.name.first.includes(searchInput) || profile.name.last.includes(searchInput)){
            filteredProfiles.push(profile);
        }
    })

    // Display or remove error message as required.
    displayOrRemoveErrorMessage(filteredProfiles);

    // Generate new profile cards using filteredProfiles array of objects.
    generateProfile(filteredProfiles);
}

// Function to hide or show 'Next' or 'Prev' buttons depending on displayed profile.
const addOrRemoveButtons = (displayedProfile, data, buttons) => {
    if(displayedProfile === 0 && data.length === 1){
        buttons[0].style.visibility = 'hidden';
        buttons[1].style.visibility = 'hidden';
    } else if (displayedProfile === 0){
        buttons[0].style.visibility = 'hidden';
        buttons[1].style.visibility = 'visible';
    } else if (displayedProfile === data.length -1){
        buttons[0].style.visibility = 'visible';
        buttons[1].style.visibility = 'hidden';
    }
}

// Function to check if no search matches are found. Displays error message if so, removes error message (if it exists) if not.
const displayOrRemoveErrorMessage = results => {
    if(results.length === 0) {
        if(document.querySelector('.errorMessage') === null){
            let noResultsFound = document.createElement('p');
            noResultsFound.className = 'errorMessage';
            noResultsFound.textContent = 'No results found. Try again.';
            document.querySelector('body').insertBefore(noResultsFound, gallery);
        }      
    } else {
        if(document.querySelector('.errorMessage') !== null){
            document.querySelector('.errorMessage').style.display = 'none';
        }       
    }
}

// Generate a random color to use as background color on modal windows.
const generateRandomColor = () => {
    let numbers = [];

    while(numbers.length < 3){
        numbers.push(Math.floor(Math.random() * (255 - 0 + 1) + 0));
    }

    let newColor = `rgba(${numbers[0]},${numbers[1]},${numbers[2]},0.5)`;
    return newColor;
}