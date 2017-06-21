var lol = document.querySelector('.lol');
var lol_lis = document.querySelectorAll('.lol > li');
var firstAddCard = document.querySelector('.add-card');
var addList = document.querySelector("#addList");
var dummyCard = document.querySelector("#dummy-card");


firstAddCard.addEventListener("click", function (){
    var newLink = document.createElement('a');
    var linkText = document.createTextNode("my title text");
    var newCard = document.createElement('li');
    
    newLink.appendChild(linkText);
    newLink.href = '#';
    
    newCard.appendChild(newLink);
    
    var newbg = document.querySelector('#bg');
    newbg.style.display = "block";
    
    var card = document.querySelector('.card');
    card.style.display = 'block';
    var listOfCard = lol_lis[0].querySelector('ul');
    listOfCard.appendChild(newCard);
});

addList.addEventListener('click', function(){
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
    

    lol.insertBefore(newList, addList);
    
    addCard.addEventListener("click", function(){
        var newLink = document.createElement('a');
        var linkText = document.createTextNode("my title text");
        var newCard = document.createElement('li');

        newLink.appendChild(linkText);
        newLink.href = '#';

        newCard.appendChild(newLink);
        cardList.appendChild(newCard);
    });
    
});