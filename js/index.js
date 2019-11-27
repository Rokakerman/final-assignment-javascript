function reload() {
    location.reload();
}

refresh();

function hide() {
    document.getElementById("main_title").classList.remove("heading");
}

function refresh() {
    let background = document.getElementById("body");
    let dir = "images/bg";
    let randomNr = Math.floor(Math.random() * 10);
    let jpeg = ".jpg";
    background.style.backgroundImage = "url(" + dir + randomNr + jpeg + ")";
}

document.getElementById("test").addEventListener("mouseenter", function dropdown() {
    // document.getElementById("list").classList.add("ul");
    // document.getElementById("test").addEventListener("mouseleave", dropup);
    let list = document.querySelectorAll("li"); //.addEventListener("click", listSelection);
    for (i = 0; i < list.length; i++) {
        list[i].addEventListener("click", listSelection);
    }
})

function listSelection(event) {
    console.log(event);
    let selector = event.target.innerHTML;
    console.log(selector);
    event.target.classList.add("border");
    document.getElementById("user_preference").innerHTML = selector;
    searchAmount.innerHTML = selector;
    // DU VAR HÄR <---------------------------------------
}

function dropup() {
    document.getElementById("list").classList.remove("ul");
}

document.getElementById("entered").addEventListener("keyup", function(event) {
    // Kör images funktionen när man klickar på 'Enter'
    if (event.keyCode === 13) {
        images();
        
    }
})

/* images funktionen retunerar en lista med bilder,
   som hämtas ifrån 'getPictures' funktionen */
let images = async () => {
    // Här hämtas x antal bild objekt
    let data =  await getPictures();
    let photo = data.photos.photo;
    document.getElementById("figure").classList.add("figure_gallery_page_box");
    for(let i = 0; i < data.photos.photo.length; i++) {
        //här skapas en bild  url för varje varv i loopen
        creatPicture(data.photos.photo[i]);
    }
    return photo;
}

/* getPictures funktionen hämtar ett antal bilder från Flickr 
   som matchar sökordet som användaren angav */
let getPictures = async () => {
    const URL ="https://api.flickr.com/services/rest?";
    const APIKEY ="api_key=19d3e6e0acfe9c438f368e2c2bab1c5d";
    const AND ="&";
    const METHOD ="method=flickr.photos.search";
    const FILTER ="text=";
    let searchWord = document.getElementById("entered").value;
    let searchAmount = document.getElementById("user_preference").value;
    let perPage = "per_page=" + searchAmount;
    const JASON ="&page=1&format=json&nojsoncallback=1";
    // let maxPreceded = false;
    let maxPreceded = checkAmount(searchAmount);
    console.log('Hello', maxPreceded)

    if (maxPreceded == false) {    
        assignClasses();
        let response = await fetch(URL + APIKEY + AND + METHOD + AND + 
        FILTER + searchWord + AND + perPage + JASON, {method: "GET"});
        let data = await response.json();
        //console.log(data.photos.photo[i])
        return await data;
    } else {
        alert("You can only choose to display a maximum of 500 pictures!")
    }
}

/* en funktion som kollar om användaren vill söka på mer an 500 bilder */

function checkAmount(searchAmount) {
    console.log("hej");
    if (searchAmount > 500) {
        // let replace = document.getElementById("user_preference").value;
        replace = 500;
        document.getElementById("user_preference").value = replace;
        searchAmount = replace;
        maxPreceded = true;
        console.log('Tjo', maxPreceded);
        return true
    }
    else {return false}
}

function assignClasses() {
    // class utdelning
    document.querySelector("h1").classList.add("hide");
    document.getElementById("figure_title").classList.add("show");
    document.getElementById("body").classList.add("row");
    document.getElementById("gallery").innerHTML = "";
    document.getElementById("figure").classList.add("figure_gallery_page_box");
    document.getElementById("entered").classList.add("input_gallery_page");
    document.getElementById("user_preference").classList.add("input_gallery_page");
    document.getElementById("user_preference").classList.add("input_gallery_quantity");
    document.getElementById("body").classList.add("body_gallery_page");
    document.getElementById("figure_title").classList.add("h1");
    document.getElementById("figure_title").addEventListener("click", reload);

    document.getElementById("main_title").classList.remove("heading");
    document.getElementById("figure").classList.add("hide");
}

let creatPicture = async (photo) => {
    /* Här konstrueras en bild url */
    let id = photo.id;
    let serverId = photo.server;
    let farmId = photo.farm;
    let secret = photo.secret;

    let url = "https://farm" + farmId + ".staticflickr.com/" + serverId 
    + "/" + id + "_" + secret + "_n.jpg";
    displayPicture(url);
}

let displayPicture = async (url) => {
 /* Här skapas bild elementen och dess parent som sedan
    läggs till i html domen */
    let imageWrapper = document.createElement("figure");
    imageWrapper.classList.add("img_box");
    let picture = document.createElement("img");
    picture.setAttribute("src", url);
    picture.classList.add("image_props");
    // Här läggs ett click event till med lightBox funktionen
    picture.addEventListener("click", openLightBox);

    let gallery = document.getElementById("gallery");
    gallery.classList.add("gallery");
    gallery.classList.remove("hide");
    gallery.appendChild(imageWrapper);
    imageWrapper.appendChild(picture);

}

let epmtyGallery = async = () => {
    document.getElementById("gallery").innerHTML = "";
}


/* Här skapas ett lightbox event
   som hämtar targets url och ersätter dess storlek "_n" med "_b" */
function openLightBox(event) {
    document.getElementById("overlay").classList.add("dim_show");
    let url = event.target.attributes[0].nodeValue;
    let size = url.replace("_n", "_b");
    highlight = document.getElementById("lightbox_img");
    highlight.setAttribute("src", size);
    highlight.classList.add("lightbox_image");
    highlight.addEventListener("click", removeLightBox);
    document.getElementById("lightbox").classList.add("lightbox");
}

/* spotlight användes först för att försöka förhindra
   webbläsaren att vissa upp den gammla bilden i lightboxen
   innan den nya laddas in. */
function spotlight(highlight) {
    highlight.classList.add("lightbox_image");
    highlight.addEventListener("click", removeLightBox);
    document.getElementById("lightbox").classList.add("lightbox");
}

/* Här tas lightboxen bort */
function removeLightBox(event) {
    let url = event.target.attributes[2].nodeValue;
    url.innerHTML = "";
    document.getElementById("lightbox").classList.remove("lightbox");
    document.getElementById("overlay").classList.remove("dim_show");
}