/* 
    Fetch 12 random users including name, location, email, picture, cell number (usa and canada), date of birth.
    
*/
fetch('https://randomuser.me/api/?results=12&inc=name,location,email,picture,cell,dob&nat=us,ca')
    .then(data => data.json())
    .then(data => {
        // Generate a profile card for each result.
        generateProfile(data.results);
        
        // Submit event listener on form to filter profiles.
        document.querySelector('form').addEventListener('submit', e => {
            e.preventDefault();
            filterProfiles(e.target.firstElementChild.value.toLowerCase(), data.results);
        })
    })
   .catch(error => console.log('Looks like there was a problem', error))

// Dynamically add search bar.
document.querySelector('.search-container').innerHTML = 
    `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>`
