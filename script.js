var ID;
var currentYear = new Date().getFullYear();
document.getElementById("addYear").setAttribute('max', currentYear);
var cardList = document.getElementById("movie-card-list");
var selList = document.getElementById("upID");
var request = new XMLHttpRequest()
request.open('GET', 'https://ghibliapi.herokuapp.com/films', true)
request.onload = function () {
	var data = JSON.parse(this.response)
	data.forEach(movie => {
		const movie_card = document.createElement('div')
		movie_card.setAttribute('class', `movie-card`)
		movie_card.setAttribute('style', `background-image: url(${movie.image})`)
		movie_card.setAttribute('id', `${movie.id}`)
		cardList.appendChild(movie_card)
		movie_card.innerHTML=
									`
									<div class="movie-card__overlay"></div>
									<div class="movie-card__share">
									  <a onclick="setID('${movie.id}', 'up')" href="#ex1" rel="modal:open" class="movie-card__icon"><i class="fas fa-edit"></i></a>
									  <a onclick="setID('${movie.id}', 'del')"  href="#ex2" rel="modal:open" class="movie-card__icon"><i class="fas fa-trash"></i></a>
									</div>
									<div class="movie-card__content">
									  <div class="movie-card__header">
										<h1 id="${movie.id}title" class="movie-card__title">${movie.title}</h1>
										<h4 class="movie-card__info">${movie.release_date}	Score:${movie.rt_score}</h4>
									  </div>
									  <p class="movie-card__desc">${movie.description.substr(0,150)}...</p>
									  <button class="mBtn mBtn-outline movie-card__button" type="button">Watch Trailer</button>
									</div>								
									`;
		const sel = document.createElement('option');
		sel.setAttribute('value', movie.id);
		sel.setAttribute('id',movie.id+"sel")
		sel.innerHTML=movie.id;
		selList.appendChild(sel);
	  })

}
request.send()

function setID(x, t){
	if(t = "del"){
		ID = x;
	}
	if(t = "up"){
		ID = x;
		document.getElementById("upID").value = x;
	}
}

function show(x){
	switch(x){
		case 1:
			if(document.getElementById("add-movie-form").className === "show"){
				document.getElementById("add-movie-form").className="hidden";
			}
			else if(document.getElementById("add-movie-form").className === "hidden"){
				document.getElementById("add-movie-form").className="show";
			}
			break;
	}

}
function addMovie(){
	var title = document.getElementById("addTitle").value;
	var image = document.getElementById("addImage").value;
	var details = document.getElementById("addDetails").value;
	var year = document.getElementById("addYear").value;
	var score = document.getElementById("addScore").value;

	var postRequest = new XMLHttpRequest();
	postRequest.open('POST', 'https://ghibliapi.herokuapp.com/films', true);
	postRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	var pData = (`title=${title}&image=${image}&release_date=${year}&rt_score=${score}&description=${details}`);
	postRequest.onload = function(){
		var data = JSON.parse(this.responseText);
		if (postRequest.readyState == 4 && postRequest.status == "201") {
			console.log(data.id+" added successfully!");
			const movie_card = document.createElement('div')
			movie_card.setAttribute('class', 'movie-card')
			movie_card.setAttribute('style', `background-image: url(${data.image})`)
			cardList.appendChild(movie_card)
		
			movie_card.innerHTML=
											`
											<div class="movie-card__overlay"></div>
											<div class="movie-card__share">
											<a onclick="javascript:void(0)" class="movie-card__icon"><i class="fas fa-edit"></i></a>
											<a onclick="javascript:void(0)" class="movie-card__icon"><i class="fas fa-trash"></i></a>
											</div>
											<div class="movie-card__content">
											  <div class="movie-card__header">
												<h1 class="movie-card__title">${data.title}</h1>
												<h4 class="movie-card__info">${data.release_date}	Score:${data.rt_score}</h4>
											  </div>
											  <p class="movie-card__desc">${data.description.substr(0,150)}...</p>
											  <button class="mBtn mBtn-outline movie-card__button" type="button">Watch Trailer</button>
											</div>								
											`		
		}
		else {
			console.error(users);
		}
	}
	postRequest.send(pData);
}
function upMovie(){
	var url = "https://ghibliapi.herokuapp.com/films";

	var data = {};
	data.id = document.getElementById("upID").value;
	data.title = document.getElementById("upTitle").value;
	data.image = document.getElementById("upImage").value;
	data.details = document.getElementById("upDetails").value;
	data.year = document.getElementById("upYear").value;
	data.score = document.getElementById("upScore").value;
	var json = JSON.stringify(data);
	
	var xhr = new XMLHttpRequest();
	xhr.open("PUT", url+'/'+data.id, true);
	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xhr.onload = function () {
		var users = JSON.parse(xhr.responseText);
		if (xhr.readyState == 4 && xhr.status == "200") {
			console.log(users.id+ " updated successfully!");
			alert(users.id + "updated!");
			document.getElementById(users.id).setAttribute('style', "background-image: url("+data.image+");");
			document.getElementById(users.id).innerHTML=`
																<div class="movie-card__overlay"></div>
																<div class="movie-card__share">
																<a onclick="setID('${users.id}', 'up')" href="#ex1" rel="modal:open" class="movie-card__icon"><i class="fas fa-edit"></i></a>
									  							<a onclick="setID('${users.id}', 'del')"  href="#ex2" rel="modal:open" class="movie-card__icon"><i class="fas fa-trash"></i></a>
																</div>
																<div class="movie-card__content">
																<div class="movie-card__header">
																	<h1 id="${users.id}title" class="movie-card__title">${data.title}</h1>
																	<h4 class="movie-card__info">${data.year}	Score:${data.score}</h4>
																</div>
																<p class="movie-card__desc">${data.details.substr(0,150)}...</p>
																<button class="mBtn mBtn-outline movie-card__button" type="button">Watch Trailer</button>
																</div>								
																`;
		}
		else {
			console.error(users);
		}
	}
	xhr.send(json);	
}
function delMovie(x){
		var url = "https://ghibliapi.herokuapp.com/films";
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", url+'/'+x, true);
		xhr.onload = function () {
			var users = JSON.parse(xhr.responseText);
			if (xhr.readyState == 4 && xhr.status == "200") {
				console.log(x+" deleted successfully!")
				document.getElementById(x).className="hidden";
				document.getElementById(x+"sel").setAttribute('style', 'display:none;')
				alert(x+" deleted!");
			} else {
				console.log(users);
			}
		}
		xhr.send();
}

// Update Form Control Start
const submitUp = document.getElementById("submitUp");
submitUp.addEventListener("click", validateUp);

function validateUp(e) {
  e.preventDefault();
  let validUp = true;
  const firstNameField = document.getElementById("upTitle");
  const imageField = document.getElementById("upImage");
  const scoreField = document.getElementById("upScore");
  const yearField = document.getElementById("upYear");
  const detailsField = document.getElementById("upDetails");

  if (!firstNameField.value) {
    const nameError = document.getElementById("nameError");
    nameError.classList.add("visible");
    firstNameField.classList.add("invalid");
    nameError.setAttribute("aria-hidden", false);
    nameError.setAttribute("aria-invalid", true);
	nameError.innerHTML = "Name cannot null!"
	validUp=false;
  }
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  if(!imageField.value){
	const imageError = document.getElementById("imageError");
    imageError.classList.add("visible");
    imageField.classList.add("invalid");
    imageError.setAttribute("aria-hidden", false);
    imageError.setAttribute("aria-invalid", true);
	imageError.innerHTML = "Image cannot null!"
	validUp=false;
  }
  else if(!pattern.test(imageField.value)){
	const imageError = document.getElementById("imageError");
    imageError.classList.add("visible");
    imageField.classList.add("invalid");
    imageError.setAttribute("aria-hidden", false);
    imageError.setAttribute("aria-invalid", true);
	imageError.innerHTML = "URL is not correct!"
	validUp=false;
  }
  if(!scoreField.value){
	const scoreError = document.getElementById("scoreError");
    scoreError.classList.add("visible");
    scoreField.classList.add("invalid");
    scoreError.setAttribute("aria-hidden", false);
    scoreError.setAttribute("aria-invalid", true);
	scoreError.innerHTML = "Score cannot null!"
	validUp=false;
  }
  if(!yearField.value){
	const yearError = document.getElementById("yearError");
    yearError.classList.add("visible");
    yearField.classList.add("invalid");
    yearError.setAttribute("aria-hidden", false);
    yearError.setAttribute("aria-invalid", true);
	yearError.innerHTML = "Year cannot null!"
	validUp=false;
  }
  if(!detailsField.value){
	const detailsError = document.getElementById("detailsError");
    detailsError.classList.add("visible");
    detailsField.classList.add("invalid");
    detailsError.setAttribute("aria-hidden", false);
    detailsError.setAttribute("aria-invalid", true);
	detailsError.innerHTML = "Details cannot null!"
	validUp=false;
  }
  console.log(validUp);
  if(validUp){
	upMovie();
  }
}
function controlUp(x){
	const firstNameField = document.getElementById("upTitle");
	const imageField = document.getElementById("upImage");
	const scoreField = document.getElementById("upScore");
	const yearField = document.getElementById("upYear");
	const detailsField = document.getElementById("upDetails");
	switch (x){
		case 'name':
			const nameError = document.getElementById("nameError");
			if (!firstNameField.value) {
				nameError.classList.add("visible");
				firstNameField.classList.add("invalid");
				firstNameField.classList.remove("valid");
				nameError.setAttribute("aria-hidden", false);
				nameError.setAttribute("aria-invalid", true);
				nameError.innerHTML = "Name cannot null!"
			  }
			else{
				nameError.classList.remove("visible");
				firstNameField.classList.remove("invalid");
				firstNameField.classList.add("valid");
				nameError.setAttribute("aria-hidden", true);
				nameError.setAttribute("aria-invalid", false);
			}
			  break;
		case 'image':
			const imageError = document.getElementById("imageError");
			var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		
		  if(!imageField.value){
			imageError.classList.add("visible");
			imageField.classList.add("invalid");
			imageField.classList.remove("valid");
			imageError.setAttribute("aria-hidden", false);
			imageError.setAttribute("aria-invalid", true);
			imageError.innerHTML = "E-mail cannot null!"
		  }
		  else if(!pattern.test(imageField.value)){
			imageError.classList.add("visible");
			imageField.classList.add("invalid");
			imageField.classList.remove("valid");
			imageError.setAttribute("aria-hidden", false);
			imageError.setAttribute("aria-invalid", true);
			imageError.innerHTML = "URL is not correct!"
		  }
		else{
			imageError.classList.remove("visible");
			imageField.classList.remove("invalid");
			imageField.classList.add("valid");
			imageError.setAttribute("aria-hidden", true);
			imageError.setAttribute("aria-invalid", false);
		}
		  break;
		case 'score':
			const scoreError = document.getElementById("scoreError");
			if(!scoreField.value){
				scoreError.classList.add("visible");
				scoreField.classList.add("invalid");
				scoreField.classList.remove("valid");
				scoreError.setAttribute("aria-hidden", false);
				scoreError.setAttribute("aria-invalid", true);
				scoreError.innerHTML = "Score cannot null!"
			  }
			else if(scoreField.value < 0 || scoreField.value > 100){
				if(scoreField.value < 0 ){
					scoreError.classList.add("visible");
					scoreField.classList.add("invalid");
					scoreField.classList.remove("valid");
					scoreError.setAttribute("aria-hidden", false);
					scoreError.setAttribute("aria-invalid", true);
					scoreError.innerHTML = "Score cannot less than 0!";
					scoreField.value = null;
				}
				if(scoreField.value > 100){
					scoreError.classList.add("visible");
					scoreField.classList.add("invalid");
					scoreField.classList.remove("valid");
					scoreError.setAttribute("aria-hidden", false);
					scoreError.setAttribute("aria-invalid", true);
					scoreError.innerHTML = "Score cannot greater than 100!";
					scoreField.value = null;
				}
			}
			else{
				scoreError.classList.remove("visible");
				scoreField.classList.remove("invalid");
				scoreField.classList.add("valid");
				scoreError.setAttribute("aria-hidden", true);
				scoreError.setAttribute("aria-invalid", false);
			}
			break;
		case 'year':
			const yearError = document.getElementById("yearError");
			if(!yearField.value){
				yearError.classList.add("visible");
				yearField.classList.add("invalid");
				yearField.classList.remove("valid");
				yearError.setAttribute("aria-hidden", false);
				yearError.setAttribute("aria-invalid", true);
				yearError.innerHTML = "Year cannot null!"
			  }
			else if(yearField.value < 1888 || yearField.value > currentYear){
				if(yearField.value < 1888 ){
					yearError.classList.add("visible");
					yearField.classList.add("invalid");
					yearField.classList.remove("valid");
					yearError.setAttribute("aria-hidden", false);
					yearError.setAttribute("aria-invalid", true);
					yearError.innerHTML = "Year cannot less than 1888!";
					yearField.value = null;
				}
				if(yearField.value > currentYear){
					yearError.classList.add("visible");
					yearField.classList.add("invalid");
					yearField.classList.remove("valid");
					yearError.setAttribute("aria-hidden", false);
					yearError.setAttribute("aria-invalid", true);
					yearError.innerHTML = "Year cannot greater than "+currentYear+'!';
					yearField.value = null;
				}
			}
			else{
				yearError.classList.remove("visible");
				yearField.classList.remove("invalid");
				yearField.classList.add("valid");
				yearError.setAttribute("aria-hidden", true);
				yearError.setAttribute("aria-invalid", false);
			}
			break;
		case 'details':
			const detailsError = document.getElementById("detailsError");
			if(!detailsField.value){
				detailsError.classList.add("visible");
				detailsField.classList.add("invalid");
				detailsField.classList.remove("valid");
				detailsError.setAttribute("aria-hidden", false);
				detailsError.setAttribute("aria-invalid", true);
				detailsError.innerHTML = "Details cannot null!"
			  }
			else{
				detailsError.classList.remove("visible");
				detailsField.classList.remove("invalid");
				detailsField.classList.add("valid");
				detailsError.setAttribute("aria-hidden", true);
				detailsError.setAttribute("aria-invalid", false);
			}
	}
	if(firstNameField.value && imageField.value && scoreField.value && yearField.value && detailsField.value){
		var add = document.getElementById("submitUp");
		add.removeAttribute('disabled');
		add.classList.remove("disabled");
	}
	else{
		var add = document.getElementById("submitUp");
		add.setAttribute('disabled', '');
		add.classList.add("disabled");
	}
}
// Update Form Control End

// Add Form Control Start
const submitAdd = document.getElementById("submitAdd");
submitAdd.addEventListener("click", validateAdd);

function validateAdd(e) {
  e.preventDefault();
  let validAdd = true;
  const firstNameField = document.getElementById("addTitle");
  const imageField = document.getElementById("addImage");
  const scoreField = document.getElementById("addScore");
  const yearField = document.getElementById("addYear");
  const detailsField = document.getElementById("addDetails");

  if (!firstNameField.value) {
    const nameError = document.getElementById("nameErrorAdd");
    nameError.classList.add("visible");
    firstNameField.classList.add("invalid");
    nameError.setAttribute("aria-hidden", false);
    nameError.setAttribute("aria-invalid", true);
	nameError.innerHTML = "Name cannot null!"
	validAdd=false;
  }
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  if(!imageField.value){
	const imageError = document.getElementById("imageErrorAdd");
    imageError.classList.add("visible");
    imageField.classList.add("invalid");
    imageError.setAttribute("aria-hidden", false);
    imageError.setAttribute("aria-invalid", true);
	imageError.innerHTML = "Image cannot null!"
	validAdd=false;
  }
  else if(!pattern.test(imageField.value)){
	const imageError = document.getElementById("imageErrorAdd");
    imageError.classList.add("visible");
    imageField.classList.add("invalid");
    imageError.setAttribute("aria-hidden", false);
    imageError.setAttribute("aria-invalid", true);
	imageError.innerHTML = "URL is not correct!"
	validAdd=false;
  }
  if(!scoreField.value){
	const scoreError = document.getElementById("scoreErrorAdd");
    scoreError.classList.add("visible");
    scoreField.classList.add("invalid");
    scoreError.setAttribute("aria-hidden", false);
    scoreError.setAttribute("aria-invalid", true);
	scoreError.innerHTML = "Score cannot null!"
	validAdd=false;
  }
  if(!yearField.value){
	const yearError = document.getElementById("yearErrorAdd");
    yearError.classList.add("visible");
    yearField.classList.add("invalid");
    yearError.setAttribute("aria-hidden", false);
    yearError.setAttribute("aria-invalid", true);
	yearError.innerHTML = "Year cannot null!"
	validAdd=false;
  }
  if(!detailsField.value){
	const detailsError = document.getElementById("detailsErrorAdd");
    detailsError.classList.add("visible");
    detailsField.classList.add("invalid");
    detailsError.setAttribute("aria-hidden", false);
    detailsError.setAttribute("aria-invalid", true);
	detailsError.innerHTML = "Details cannot null!"
	validAdd=false;
  }
  console.log(validAdd);
  if(validAdd){
	addMovie();
  }
}
function controlAdd(x){
	const firstNameField = document.getElementById("addTitle");
	const imageField = document.getElementById("addImage");
	const scoreField = document.getElementById("addScore");
	const yearField = document.getElementById("addYear");
	const detailsField = document.getElementById("addDetails");
	switch (x){
		case 'name':
			const nameError = document.getElementById("nameErrorAdd");
			if (!firstNameField.value) {
				nameError.classList.add("visible");
				firstNameField.classList.add("invalid");
				firstNameField.classList.remove("valid");
				nameError.setAttribute("aria-hidden", false);
				nameError.setAttribute("aria-invalid", true);
				nameError.innerHTML = "Name cannot null!"
			  }
			else{
				nameError.classList.remove("visible");
				firstNameField.classList.remove("invalid");
				firstNameField.classList.add("valid");
				nameError.setAttribute("aria-hidden", true);
				nameError.setAttribute("aria-invalid", false);
			}
			  break;
		case 'image':
			const imageError = document.getElementById("imageErrorAdd");
			var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		
		  if(!imageField.value){
			imageError.classList.add("visible");
			imageField.classList.add("invalid");
			imageField.classList.remove("valid");
			imageError.setAttribute("aria-hidden", false);
			imageError.setAttribute("aria-invalid", true);
			imageError.innerHTML = "Image cannot null!"
		  }
		  else if(!pattern.test(imageField.value)){
			imageError.classList.add("visible");
			imageField.classList.add("invalid");
			imageField.classList.remove("valid");
			imageError.setAttribute("aria-hidden", false);
			imageError.setAttribute("aria-invalid", true);
			imageError.innerHTML = "URL is not correct!"
			imageField.value = null;
		  }
		else{
			imageError.classList.remove("visible");
			imageField.classList.remove("invalid");
			imageField.classList.add("valid");
			imageError.setAttribute("aria-hidden", true);
			imageError.setAttribute("aria-invalid", false);
		}
		  break;
		case 'score':
			const scoreError = document.getElementById("scoreErrorAdd");
			if(!scoreField.value){
				scoreError.classList.add("visible");
				scoreField.classList.add("invalid");
				scoreField.classList.remove("valid");
				scoreError.setAttribute("aria-hidden", false);
				scoreError.setAttribute("aria-invalid", true);
				scoreError.innerHTML = "Score cannot null!"
			  }
			else if(scoreField.value < 0 || scoreField.value > 100){
				if(scoreField.value < 0 ){
					scoreError.classList.add("visible");
					scoreField.classList.add("invalid");
					scoreField.classList.remove("valid");
					scoreError.setAttribute("aria-hidden", false);
					scoreError.setAttribute("aria-invalid", true);
					scoreError.innerHTML = "Score cannot less than 0!";
					scoreField.value = null;
				}
				if(scoreField.value > 100){
					scoreError.classList.add("visible");
					scoreField.classList.add("invalid");
					scoreField.classList.remove("valid");
					scoreError.setAttribute("aria-hidden", false);
					scoreError.setAttribute("aria-invalid", true);
					scoreError.innerHTML = "Score cannot greater than 100!";
					scoreField.value = null;
				}
			}
			else{
				scoreError.classList.remove("visible");
				scoreField.classList.remove("invalid");
				scoreField.classList.add("valid");
				scoreError.setAttribute("aria-hidden", true);
				scoreError.setAttribute("aria-invalid", false);
			}
			break;
		case 'year':
			const yearError = document.getElementById("yearErrorAdd");
			if(!yearField.value){
				yearError.classList.add("visible");
				yearField.classList.add("invalid");
				yearField.classList.remove("valid");
				yearError.setAttribute("aria-hidden", false);
				yearError.setAttribute("aria-invalid", true);
				yearError.innerHTML = "Year cannot null!"
			  }
			else if(yearField.value < 1888 || yearField.value > currentYear){
				if(yearField.value < 1888 ){
					yearError.classList.add("visible");
					yearField.classList.add("invalid");
					yearField.classList.remove("valid");
					yearError.setAttribute("aria-hidden", false);
					yearError.setAttribute("aria-invalid", true);
					yearError.innerHTML = "Year cannot less than 1888!";
					yearField.value = null;
				}
				if(yearField.value > currentYear){
					yearError.classList.add("visible");
					yearField.classList.add("invalid");
					yearField.classList.remove("valid");
					yearError.setAttribute("aria-hidden", false);
					yearError.setAttribute("aria-invalid", true);
					yearError.innerHTML = "Year cannot greater than "+currentYear+'!';
					yearField.value = null;
				}
			}
			else{
				yearError.classList.remove("visible");
				yearField.classList.remove("invalid");
				yearField.classList.add("valid");
				yearError.setAttribute("aria-hidden", true);
				yearError.setAttribute("aria-invalid", false);
			}
			break;
		case 'details':
			const detailsError = document.getElementById("detailsErrorAdd");
			if(!detailsField.value){
				detailsError.classList.add("visible");
				detailsField.classList.add("invalid");
				detailsField.classList.remove("valid");
				detailsError.setAttribute("aria-hidden", false);
				detailsError.setAttribute("aria-invalid", true);
				detailsError.innerHTML = "Details cannot null!"
			  }
			else{
				detailsError.classList.remove("visible");
				detailsField.classList.remove("invalid");
				detailsField.classList.add("valid");
				detailsError.setAttribute("aria-hidden", true);
				detailsError.setAttribute("aria-invalid", false);
			}
	}
	if(firstNameField.value && imageField.value && scoreField.value && yearField.value && detailsField.value){
		var add = document.getElementById("submitAdd");
		add.removeAttribute('disabled');
		add.classList.remove("disabled");
	}
	else{
		var add = document.getElementById("submitAdd");
		add.setAttribute('disabled', '');
		add.classList.add("disabled");
	}
}
// Add Form Control End