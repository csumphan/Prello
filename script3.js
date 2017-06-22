var lol = document.querySelector('.lol');
var lol_lis = document.querySelectorAll('.lol > li');
//var firstAddCard = document.querySelector('.add-card');
var addList = document.querySelector("#addList");
var dummyCard = document.querySelector("#dummy-card");
var bg = document.querySelector("#bg");

var listOfList = [];
var title = document.querySelector(".title");
var titleForm = document.querySelector(".title-form");
var closeModal = document.querySelector(".close");
var dateButton = document.querySelector(".button");
var date = document.querySelector(".date-input");
var dateForm = document.querySelector(".date-form");
//firstAddCard.addEventListener("click", function (){
//    var newLink = document.createElement('a');
//    var linkText = document.createTextNode("my title text");
//    var newCard = document.createElement('li');
//    
//    newLink.appendChild(linkText);
//    newLink.href = '#';
//    
//    newCard.appendChild(newLink);
//    
//    var newbg = document.querySelector('#bg');
//    newbg.style.display = "block";
//    
//    
//    var card = document.querySelector('.card');
//    card.style.display = 'block';
//    var listOfCard = lol_lis[0].querySelector('ul');
//    listOfCard.appendChild(newCard);
//});

addList.addEventListener('click', function(){
    listOfList.push([]);

    var newList = document.createElement('li');
    var listText = document.createTextNode("New List");
    var cardList = document.createElement('ul');
    var addCard = document.createElement('p');

    newList.appendChild(listText);
    
    addCard.appendChild(document.createTextNode("Add Card"));
    addCard.className += " add-card clickable";
    
    
    cardList.className += " card-list";
    
    newList.appendChild(cardList);
    newList.appendChild(addCard);
    newList.id = listOfList.length - 1;
    
    console.log(newList.id);

    lol.insertBefore(newList, addList);
    
    addCard.addEventListener("click", function(){
        
        var newLink = document.createElement('a');
        var linkText = document.createTextNode("my title text");
        var newCard = document.createElement('li');

        newLink.appendChild(linkText);
        newLink.href = '#';

        newCard.appendChild(newLink);
        cardList.appendChild(newCard);
        
        listOfList[this.parentNode.id].push(newCard);
        console.log(listOfList);
    });
    
});

bg.addEventListener("click", function() {
    bg.style.display = "none";
    document.querySelector(".card").style.display = "none";
});

//////////Events for Card///////////////////
title.addEventListener('focusout',function(){
    console.log(title.value);
    if(title.value === "") {
        title.value = "Title";
    }
});

titleForm.addEventListener('submit',function(e){
    e.preventDefault();
    title.blur();
});

closeModal.addEventListener('click', function(){
    bg.style.display = "none";
    document.querySelector(".card").style.display = "none";
});

dateButton.addEventListener('click', function(){
    if(this.nextElementSibling.style.display === "block") {
        this.nextElementSibling.style.display = "none";
    }
    
    else {
    this.nextElementSibling.style.display = "block";
    }
});

dateForm.addEventListener('focusout', function(){
    if(date.value !== "") 
    {
        var dateTitle = document.querySelector('.date-text');
        dateTitle.innerHTML = "Due Date: ";

        console.log(date.value);
        var formatDate = date.value.slice(0,10) + " @ " + date.value.slice(11);

      dateTitle.appendChild(document.createTextNode(formatDate));
    }
    
    this.style.display = "none";
    
});

function createCard(){
    var card = document.createElement("div");
    card.className += " card";
    
    var modalHeader = document.createElement("div");
    modalHeader.className += " modal-header";
    
    var titleF = document.createElement("form");
    titleF.className += " title-form";
    
    var newTitle = document.createElement("input");
    newTitle.id
}