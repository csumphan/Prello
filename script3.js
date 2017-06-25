var lol = $('.lol');
var lol_lis = document.querySelectorAll('.lol > li');
var addList = document.querySelector("#addList");
var bg = document.querySelector(".bg");

var listOfList = [];

$('.lol').on('click',".list-close", function(e){
    if(confirm("Warning! Are you sure you want to delete this list?" + e.target.classList)) {
        
        console.log("attr.id: " + e.target.parentElement.id);
        var index = getListId(e.target.parentElement.id);
        //remove modal cards from html
        for(var x = 0; x < listOfList[index].length; x++) {  document.querySelector('body').removeChild(listOfList[index][x].modalView);
        }

        //removes mini card and list from html
        //newList.parentElement.removeChild(newList);
        $("#" + e.target.parentElement.id).remove();

        //updates list id after deleted list to be one less
        console.log("Index: " + index);
        console.log("Length of ListofList" + listOfList.length);
        for(var x = index+1; x < listOfList.length; x++) {
            document.getElementById("list-" + x).id = 
                "list-" + (x-1);
        }

        //removes deleted list from data structure
        listOfList.splice(index, 1);

        //changes all lists' id and card id after deleted list
        for(var x = index; x < listOfList.length; x++) {
            for(var y = 0; y < listOfList[x].length; y++) {
                var prevId = getCardID(listOfList[x][y].miniView.id);
                //console.log(listOfList[x].miniView);
                listOfList[x][y].miniView.id = "miniCard-" + x + "-" + y;

                listOfList[x][y].modalView.id = "modalCard-" + x + "-" + y;
            }
        }
        }           
        
        
    });

$('.lol').on('click',".card-list .mini-card", function(e){
    console.log("this: " + $(this).attr('class'));
    var splitID = getCardID(e.currentTarget.id);
    console.log("target id: " + e.currentTarget.id);
    console.log(listOfList[0][0].modalView);
    var modalCard = listOfList[splitID[0]][splitID[1]].modalView;
    
    modalCard.style.display = "block";
    bg.style.display = "block";
    
    bgGetID(e.currentTarget.id);
});

$('.lol').on("click", ".add-card", function(e){

    //get index of list and cardlist for this card
    var listID = getListId(e.target.parentElement.id);
    var cardIndex = listOfList[listID].length;

    //creates the mini card view
    var miniCard = document.createElement('li');
    var newLink = document.createElement('div');
    var linkText = document.createTextNode("Title");
    var selectedLabel = document.createElement('ul');
    selectedLabel.className += " label-container";

    miniCard.id = "miniCard-" + listID + "-" + cardIndex; 
    miniCard.className += " mini-card"
    newLink.appendChild(linkText);
    //newLink.href = '#';

    miniCard.appendChild(newLink);
    miniCard.appendChild(selectedLabel);
    
    //add mini card to card list
    var cardListSelector = "#" + e.target.parentElement.id + " .card-list";
    
    $(cardListSelector).append(miniCard);

    //creates the actual card
    bg.style.display = "block";
    var modalCard = createCard(listID,cardIndex);
    modalCard.style.display = "block";
    bgGetID(modalCard.id);

    //id format of modalCard and miniCard
    //modalCard = "modalCard [list index] [cardlist index]
    //miniCard = "miniCard [list index] [cardlist index]

    //create object literal containing both miniCard and modalCard
    var card = {miniView: miniCard, modalView: modalCard};

    miniCard.addEventListener('click',function(){
        modalCard.style.display = "block";
        bg.style.display = "block";

        bgGetID(modalCard.id);
    });

    //append card into a list in a list
    listOfList[listID].push(card);
});

addList.addEventListener('click', function(){
    //when a list is added a container representing a list of cards is
    //added to the underlying data structure.
    listOfList.push([]);
    
    
    var newList = document.createElement('li');
    
    var listForm = document.createElement('form');
    var listInput = document.createElement('input');
    var closeB = document.createElement('span');
    var addCard = document.createElement('p');
    
    var cardList = document.createElement('ul');
    cardList.className += " card-list";
    
    listForm.className += " list-form";
    listInput.className += " list-title";
    listInput.value = "Title " + listOfList.length; 
    listInput.type = "text";
    
    listForm.appendChild(listInput);
    
    closeB.className += " close list-close";
    closeB.innerHTML = "&times;";
    
    //var addCard = $("<p></p>").text("Add Card");
    addCard.appendChild(document.createTextNode("Add Card"));
    //addCard.addClass("add-card clickable");
    addCard.className += " add-card clickable";
    
    
    cardList.className += " card-list";
    
    newList.appendChild(listForm);
    newList.appendChild(closeB);
    newList.appendChild(cardList);
    newList.appendChild(addCard);
    
    //each list will have an id, which is the index of the list in the
    //data structure
    newList.id = "list-" + (listOfList.length - 1);
    newList.className = "list";
    

    addList.before(newList);
    
//    closeB.addEventListener('click', function(){
//        if(confirm("Warning! Are you sure you want to delete this list?")) {
//            var index = getListId(newList.id);
//            
//            //remove modal cards from html
//            for(var x = 0; x < listOfList[index].length; x++) {  document.querySelector('body').removeChild(listOfList[index][x].modalView);
//            }
//            
//            //removes mini card and list from html
//            newList.parentElement.removeChild(newList);
//            
//            //updates list id after deleted list to be one less
//            console.log("Index: " + index);
//            console.log("Length of ListofList" + listOfList.length);
//            for(var x = index+1; x < listOfList.length; x++) {
//                document.getElementById("list-" + x).id = 
//                    "list-" + (x-1);
//            }
//            
//            //removes deleted list from data structure
//            listOfList.splice(index, 1);
//            
//            //changes all lists' id and card id after deleted list
//            for(var x = index; x < listOfList.length; x++) {
//                for(var y = 0; y < listOfList[x].length; y++) {
//                    var prevId = getCardID(listOfList[x][y].miniView.id);
//                    //console.log(listOfList[x].miniView);
//                    listOfList[x][y].miniView.id = "miniCard-" + x + "-" + y;
//
//                    listOfList[x][y].modalView.id = "modalCard-" + x + "-" + y;
//                }
//            }
//            }           
//        
//        
//    });
    
    //adds a new card to its respective list
//    addCard.addEventListener("click", function(){
//        
//        //get index of list and cardlist for this card
//        var listID = getListId(this.parentNode.id);
//        var cardIndex = listOfList[listID].length;
//        
//        //creates the mini card view
//        var miniCard = document.createElement('li');
//        var newLink = document.createElement('div');
//        var linkText = document.createTextNode("Title");
//        var selectedLabel = document.createElement('ul');
//        selectedLabel.className += " label-container";
//        
//        miniCard.id = "miniCard-" + listID + "-" + cardIndex; 
//        miniCard.className += " mini-card"
//        newLink.appendChild(linkText);
//        //newLink.href = '#';
//
//        miniCard.appendChild(newLink);
//        miniCard.appendChild(selectedLabel);
//        cardList.appendChild(miniCard);
//        
//        //creates the actual card
//        bg.style.display = "block";
//        var modalCard = createCard(listID,cardIndex);
//        modalCard.style.display = "block";
//        bgGetID(modalCard.id);
//        
//        //id format of modalCard and miniCard
//        //modalCard = "modalCard [list index] [cardlist index]
//        //miniCard = "miniCard [list index] [cardlist index]
//        
//        //create object literal containing both miniCard and modalCard
//        var card = {miniView: miniCard, modalView: modalCard};
//        
//        miniCard.addEventListener('click',function(){
//            modalCard.style.display = "block";
//            bg.style.display = "block";
//            
//            bgGetID(modalCard.id);
//        });
//        
//        //append card into a list in a list
//        listOfList[listID].push(card);
//    });
    
});

bg.addEventListener("click", function() {
    bg.style.display = "none";
    var cardIndex = getCardID(bg.id);
    console.log(cardIndex);
    listOfList[cardIndex[0]][cardIndex[1]].modalView.style.display = "none";
    
});


function bgGetID(cardID) {
    var splitID = cardID.split("-");
    bg.id = "bg-" + splitID[1] + "-" + splitID[2];
}
//modalCard = "modalCard [list index] [cardlist index]
function getCardID(id) {
    var splitID = id.split("-");
    return [parseInt(splitID[1]),parseInt(splitID[2])];
}
function getListId(id) {
    return parseInt(id.substring(5));
}

function createCard(listID, cardIndex){
    
    //Create card div (card object) 
    var card = document.createElement("div");
    card.className += " card";
    card.id = "modalCard-" + listID + "-" + cardIndex;
    
    //create card title
    var modalHeader = document.createElement("div");
    modalHeader.className += " modal-header";
    
    var titleF = document.createElement("form");
    titleF.className += " title-form";
    
    var newTitle = document.createElement("input");
    newTitle.className += " title";
    newTitle.type = "text";
    newTitle.value = "Title";
    
    titleF.appendChild(newTitle);
    
    var cardCloseButton = document.createElement("span");
    cardCloseButton.className += " close";
    cardCloseButton.innerHTML = "&times;";
    
    //adds eventlistener to title
    titleF.addEventListener('focusout',function(){
        if(newTitle.value === "") {
            newTitle.value = "Title";
        }
        listOfList[listID][cardIndex].miniView.firstChild.innerHTML = newTitle.value;
        
    });
    titleF.addEventListener('submit',function(e){
    e.preventDefault();
    newTitle.blur();
});
    
    //add event listener to close button
    cardCloseButton.addEventListener('click', function(){
    bg.style.display = "none";
    card.style.display = "none";
});
    
    modalHeader.appendChild(titleF);
    modalHeader.appendChild(cardCloseButton);
    
    //create card date selector
    var modalDate = document.createElement("div");
    modalDate.className += " modal-date";
    
    var dateTitle = document.createElement("h3");
    dateTitle.innerHTML = "Due Date: ";
    dateTitle.className += " date-text inline";
    
    var dateB = document.createElement("div");
    dateB.innerHTML = "Edit Date";
    dateB.className += " button";
    
    var dateF = document.createElement("form");
    dateF.className += " date-form";
    
    var dateInput = document.createElement("input");
    dateInput.class += " date-input";
    dateInput.type = "datetime-local";
    
    dateF.appendChild(dateInput);
    //Add event listener to date button
    //date input appears when date button is pressed
    dateB.addEventListener('click', function(){
    if(this.nextElementSibling.style.display === "block") {
        this.nextElementSibling.style.display = "none";
    }
    
    else {
    this.nextElementSibling.style.display = "block";
    }
});
    //changes date text when input is unfocused
    dateF.addEventListener('focusout', function(){
    if(dateInput.value !== "") 
    {
        dateTitle.innerHTML = "Due Date: ";
        var formatDate = dateInput.value.slice(0,10) + " @ " + dateInput.value.slice(11);

      dateTitle.appendChild(document.createTextNode(formatDate));
    }
    
    this.style.display = "none";
    
});
    
    modalDate.appendChild(dateTitle);
    modalDate.appendChild(dateB);
    modalDate.appendChild(dateF);
    
    //create card label selector
    
    var modalLabel = document.createElement("div");
    modalLabel.className += " modal-label";
    
    var labelText = document.createElement("h5");
    labelText.className += " inline";
    labelText.innerHTML = "Label: ";
    labelText.style.margin = "5px";
    
    var selectedLabel = document.createElement('ul');
    selectedLabel.className += " label-container inline selected-label";
    
    var labelB = document.createElement("div");
    labelB.className += " label-button button";
    labelB.innerHTML = "Edit Label";
    
    var labelPicker = document.createElement("div");
    labelPicker.className += " picker label-picker";
    
    var labelPickerForm = document.createElement('form');
    labelPickerForm.className += " label-form";
    
    var labelPickerInput = document.createElement('input');
    labelPickerInput.className += " label-input";
    labelPickerInput.type = "text";
    labelPickerInput.placeholder = "Label Name";
    
    labelPickerForm.appendChild(labelPickerInput);
    
    var labelContainer = document.createElement('ul');
    labelContainer.className += " label-container";
    
    var greenLabel = document.createElement('li');
    greenLabel.className += 'label green-label click';
    
    var blueLabel = document.createElement('li');
    blueLabel.className += 'label blue-label click';
    
    var redLabel = document.createElement('li');
    redLabel.className += 'label red-label click';
    
    var yellowLabel = document.createElement('li');
    yellowLabel.className += 'label yellow-label click';
    
    var orangeLabel = document.createElement('li');
    orangeLabel.className += 'label orange-label click';
    
    var labelList = [greenLabel,blueLabel,redLabel,yellowLabel,orangeLabel];
    
    for(var x = 0; x < labelList.length; x++) {
        labelContainer.appendChild(labelList[x]);
    }
   
    
    labelPicker.appendChild(labelPickerForm);
    labelPicker.appendChild(labelContainer);
    
    
    labelB.addEventListener('click', function(){
    if(labelPicker.style.display === "block") {
        labelPicker.style.display = "none";
    }
    
    else {
    labelPicker.style.display = "block";
    }
});
    
    //loop through all labels to add event listener
    for(var x = 0; x < labelList.length; x++) {
        labelList[x].addEventListener('click', function(){
            var newLabel = document.createElement('li');
            var newLabelsm = document.createElement('li');
            var labelInput = '#' + card.id + " .label-input";
            
            
            console.log($(labelInput).val());
            
            newLabel.className += this.className;
            newLabel.innerHTML = $(labelInput).val();
            newLabelsm.className += this.className;
            newLabelsm.className += " label-sm";
            
            
            selectedLabel.appendChild(newLabel);

            var cardId = getCardID(card.id);
            var miniCard = listOfList[cardId[0]][cardId[1]].miniView;
            
            miniCard.lastElementChild.appendChild(newLabelsm);
            
            
        });
    }
    

    
    
    modalLabel.appendChild(labelText);
    modalLabel.appendChild(selectedLabel);
    modalLabel.appendChild(labelB);
    modalLabel.appendChild(labelPicker);
    
    //create card member selector
    
    var modalMember = document.createElement('div');
    modalMember.className += " member-list";
    
    var memberText = document.createElement('h3');
    memberText.innerHTML = "Members: ";
    memberText.className += " inline";
    
    var memberB = document.createElement('div');
    memberB.className += " member-button button";
    memberB.innerHTML = "Edit Members";
    
    var memberPicker = document.createElement('div');
    memberPicker.className += " picker member-picker";
    
    var memberPickerForm = document.createElement('form');
    memberPickerForm.className += "member-form";
    
    var memberPickerInput = document.createElement('input');
    memberPickerInput.className += " member-input";
    memberPickerInput.type = "text";
    memberPickerInput.placeholder = "Member Name";
    
    memberPickerForm.appendChild(memberPickerInput);
    memberPicker.appendChild(memberPickerForm);
    
    memberB.addEventListener('click',function(){
    if(memberPicker.style.display === "block") {
        memberPicker.style.display = "none";
    }
    
    else {
    memberPicker.style.display = "block";
    }
});
    
    modalMember.appendChild(memberText);
    modalMember.appendChild(memberB);
    modalMember.appendChild(memberPicker);
    
    //create card description
    
    var modalDescription = document.createElement('div');
    modalDescription.className += " description";
    
    var descTitle = document.createElement('h3');
    descTitle.innerHTML = "Description";
    
    var descText = document.createElement('p');
    descText.className += "description-text";
    
    var descEdit = document.createElement('textarea');
    descEdit.className += "description-input";
    descEdit.rows = 8;
    
    var descButton = document.createElement('div');
    descButton.className += " description-button button";
    descButton.innerHTML = "Edit Description";
    
    descButton.addEventListener('click',function(){
    if(this.previousElementSibling.style.display === "block") {
        this.previousElementSibling.style.display = "none";
    }
    
    else {
    this.previousElementSibling.style.display = "block";
    }
});
    
    modalDescription.appendChild(descTitle);
    modalDescription.appendChild(descText);
    modalDescription.appendChild(descEdit);
    modalDescription.appendChild(descButton);
    
    var modalFooter = document.createElement('div');
    modalFooter.className += " modal-footer";
    
    var removeB = document.createElement('div');
    removeB.className += " button remove";
    removeB.innerHTML = "Remove Card";
    
    removeB.addEventListener('click',function(){
        if(confirm("Warning! Are you sure you want to remove this card?")){
            //remove html miniCard element
            console.log("cardID" + card.id);
            console.log("listID: " + listID);
            console.log("cardIndex: " + cardIndex);
            console.log("$$$$$");
            console.log(listOfList[listID]);
            
            var splitID = getCardID(card.id);
            listOfList[splitID[0]][splitID[1]].miniView.parentNode.removeChild(listOfList[splitID[0]][splitID[1]].miniView);

            
          document.querySelector('body').removeChild(listOfList[splitID[0]][splitID[1]].modalView);
            
            listOfList[splitID[0]].splice(splitID[1],1);
            
            for(var x = splitID[1]; x < listOfList[splitID[0]].length; x++){
                listOfList[splitID[0]][splitID[1]].miniView.id = "miniCard-" + splitID[0] + "-" + splitID[1];
                
                listOfList[splitID[0]][splitID[1]].modalView.id = "modalCard-" + splitID[0] + "-" + splitID[1];
            }
            
            bg.style.display = "none";
        }
        else {}
    });
    
    modalFooter.appendChild(removeB);
    
    
    //Add divs to card
    card.appendChild(modalHeader);
    card.appendChild(modalDate);
    card.appendChild(modalLabel);
    card.appendChild(modalMember);
    card.appendChild(modalDescription);
    card.appendChild(modalFooter);
    
    document.querySelector('body').appendChild(card);
    
    $('.selected-label').on('click','li',function(e){
        
        var splitID = getCardID(card.id);
        var mini = "#miniCard-" + splitID[0] + "-" + splitID[1];
        var labelIndex = $(this).index();
        
        
        $(mini + " ul").children()[labelIndex].remove();
        $(this).remove();
        
        
    });
    
    return card;
}


function prepopulateBoard() {
    
    for(var x = 0; x<5; x++) {
        listOfList.push([]);

        var newList = document.createElement('li');
        var listForm = document.createElement('form');
        var listInput = document.createElement('input');
        var closeB = document.createElement('span');
        var addCard = document.createElement('p');

        var cardList = document.createElement('ul');
        cardList.className += " card-list";

        listForm.className += " list-form";
        listInput.className += " list-title";
        listInput.value = "Title " + listOfList.length; 
        listInput.type = "text";

        listForm.appendChild(listInput);

        closeB.className += " close list-close";
        closeB.innerHTML = "&times;";


        addCard.appendChild(document.createTextNode("Add Card"));
        addCard.className += " add-card clickable";


        cardList.className += " card-list";

        newList.appendChild(listForm);
        newList.appendChild(closeB);
        newList.appendChild(cardList);
        newList.appendChild(addCard);

        //each list will have an id, which is the index of the list in the
        //data structure
        newList.id = "list-" + (listOfList.length - 1);


        lol.insertBefore(newList, addList);

        closeB.addEventListener('click', function(){
            if(confirm("Warning! Are you sure you want to delete this list?")) {
                var index = getListId(this.parentElement.id);
                //console.log("deletelist: " + )
                //remove modal cards from html
                for(var x = 0; x < listOfList[index].length; x++) {  document.querySelector('body').removeChild(listOfList[index][x].modalView);
                }

                //removes mini card and list from html
                this.parentElement.parentElement.removeChild(this.parentElement);

                //updates list id after deleted list to be one less
                for(var x = index+1; x < listOfList.length; x++) {
                    document.getElementById("list-" + x).id = 
                        "list-" + (x-1);
                }

                //removes deleted list from data structure
                listOfList.splice(index, 1);

                //changes all lists' id and card id after deleted list
                for(var x = index; x < listOfList.length; x++) {
                    for(var y = 0; y < listOfList[x].length; y++) {
                        var prevId = getCardID(listOfList[x][y].miniView.id);
                        //console.log(listOfList[x].miniView);
                        listOfList[x][y].miniView.id = "miniCard-" + x + "-" + y;

                        listOfList[x][y].modalView.id = "modalCard-" + x + "-" + y;
                    }
                }
                }           


        });

        //adds a new card to its respective list
        addCard.addEventListener("click", function(){

            //get index of list and cardlist for this card
            var listID = getListId(this.parentNode.id);
            var cardIndex = listOfList[listID].length;
            var cardList = document.querySelector("#list-"+ listID + " ul"); 

            //creates the mini card view
            var miniCard = document.createElement('li');
            var newLink = document.createElement('div');
            var linkText = document.createTextNode("Title");
            var selectedLabel = document.createElement('ul');
            selectedLabel.className += " label-container";

            miniCard.id = "miniCard-" + listID + "-" + cardIndex; 
            miniCard.className += " mini-card"
            newLink.appendChild(linkText);
            //newLink.href = '#';

            miniCard.appendChild(newLink);
            miniCard.appendChild(selectedLabel);
            cardList.appendChild(miniCard);

            //creates the actual card
            bg.style.display = "block";
            var modalCard = createCard(listID,cardIndex);
            modalCard.style.display = "block";
            bgGetID(modalCard.id);

            //id format of modalCard and miniCard
            //modalCard = "modalCard [list index] [cardlist index]
            //miniCard = "miniCard [list index] [cardlist index]

            //create object literal containing both miniCard and modalCard
            var card = {miniView: miniCard, modalView: modalCard};

            miniCard.addEventListener('click',function(){
                modalCard.style.display = "block";
                bg.style.display = "block";

                bgGetID(modalCard.id);
            });

            //append card into a list in a list
            listOfList[listID].push(card);
        });        
    }
    
    var numCards = [1,10,12,0,5];
    
    for(var x = 0; x < 5; x++) {
        for(var y= 0; y < numCards[x]; y++) {
            
            var listID = x;
            var cardIndex = listOfList[x].length;
            var cardList = document.querySelector("#list-"+ x + " ul");

            //creates the mini card view
            var miniCard = document.createElement('li');
            var newLink = document.createElement('div');
            var linkText = document.createTextNode("Title");
            var selectedLabel = document.createElement('ul');
            selectedLabel.className += " label-container";

            miniCard.id = "miniCard-" + listID + "-" + cardIndex; 
            miniCard.className += " mini-card"
            newLink.appendChild(linkText);
            //newLink.href = '#';

            miniCard.appendChild(newLink);
            miniCard.appendChild(selectedLabel);
            cardList.appendChild(miniCard);

            //creates the actual card
            var modalCard = createCard(listID,cardIndex);
            bgGetID(modalCard.id);

            //id format of modalCard and miniCard
            //modalCard = "modalCard [list index] [cardlist index]
            //miniCard = "miniCard [list index] [cardlist index]

            //create object literal containing both miniCard and modalCard
            var card = {miniView: miniCard, modalView: modalCard};

            miniCard.addEventListener('click',function(){
                selfID = getCardID(this.id);

                var modalCard = listOfList[selfID[0]][selfID[1]].modalView;
                
                modalCard.style.display = "block";
                
                bg.style.display = "block";
                bgGetID(modalCard.id);
            });

            //append card into a list in a list
            listOfList[listID].push(card);
        }        
            
        }
}
//function createBoard() {
//    
//    var listHTML = "<li class='list' id='list-0'><form class='list-form'><input class='list-title' type='text' value='To-Do'></form><span class='close list-close'>&times;</span><ul class='card-list card-list'><li class='mini-card' id='miniCard-0-0'><div>Enemy Sprite</div><ul class=' label-container'><li class='label green-label click label-sm'></li><li class='label blue-label click label-sm'></li></ul></li><li class=' mini-card' id='miniCard-0-1'><div>Enemy AI Movement</div><ul class=' label-container'><li class='label red-label click label-sm'></li><li class='label yellow-label click label-sm'></li><li class='label orange-label click label-sm'></li></ul></li><li class=' mini-card' id='miniCard-0-2'><div>Character Control</div><ul class=' label-container'><li class='label blue-label click label-sm'></li></ul></li><li class=' mini-card' id='miniCard-0-3'><div>Background Design</div><ul class=' label-container'><li class='label orange-label click label-sm'></li><li class='label yellow-label click label-sm'></li></ul></li></ul><p class=' add-card clickable'>Add Card</p><li class='list' id='list-1'><form class='list-form'><input class='list-title' type='text' value='In Progress'></form><span class='close list-close'>&times;</span><ul class='card-list card-list'><li class='mini-card' id='miniCard-1-0'><div>Level Design</div><ul class=' label-container'><li class='label green-label click label-sm'></li></ul></li><li class=' mini-card' id='miniCard-1-1'><div>Enemy AI Design</div><ul class=' label-container'><li class='label red-label click label-sm'></li><li class='label yellow-label click label-sm'></li><li class='label orange-label click label-sm'></li></ul></li><li class=' mini-card' id='miniCard-1-2'><div>Character Design</div><ul class=' label-container'><li class='label yellow-label click label-sm'></li></ul></li></ul><p class=' add-card clickable'>Add Card</p>";
//    
//    var modalCards = "<div class=' card' id='modalCard-0-0' style='display: none;'><div class=' modal-header'><form class=' title-form'><input class=' title' type='text' value='Enemy Sprite'></form><span class=' close'>&times;</span></div><div class=' modal-date'><h3 class=' date-text inline'>Due Date: 2017-07-02 @ 13:00</h3><div class=' button'>Edit Date</div><form class=' date-form' style='display: none;'><input type='datetime-local'></form></div><div class=' modal-label'><h5 class=' inline' style='margin: 5px;'>Label: </h5><ul class=' label-container inline'><li class='label green-label click'></li><li class='label blue-label click'></li></ul><div class=' label-button button'>Edit Label</div><div class=' picker label-picker' style='display: block;'><form class=' label-form'><input class=' label-input' type='text' placeholder='Label Name'></form><ul class=' label-container'><li class='label green-label click'></li><li class='label blue-label click'></li><li class='label red-label click'></li><li class='label yellow-label click'></li><li class='label orange-label click'></li></ul></div></div><div class=' member-list'><h3 class=' inline'>Members: </h3><div class=' member-button button'>Edit Members</div><div class=' picker member-picker'><form class='member-form'><input class=' member-input' type='text' placeholder='Member Name'></form></div></div><div class=' description'><h3>Description</h3><p class='description-text'></p><textarea class='description-input' rows='8'></textarea><div class=' description-button button'>Edit Description</div></div><div class=' modal-footer'><div class=' button remove'>Remove Card</div></div></div>";
//    
//    $('#addList').before(listHTML);
//    $("body").append(modalCards);
//    
//    var listSize = [4,3];
//    
//    for(var x = 0; x < listSize.length; x++) {
//        
//        listOfList.push([]);
//        
//        for(var y = 0; y < listSize[x]; y++) {
//            var miniID = 'miniCard-' + x + "-" + y;
//            var modalID = 'modalCard-' + x + "-" + y;
//            
//            var mini = document.getElementById(miniID);
//            var modal = document.getElementById(modalID);
//            
//            
//            var card = {miniView: mini, modalView: modal};
//            
//            listOfList[x].push(card);
//        }
//    }
//    
//   
//    
//    
//}

function openMenu() {
    $(".menu").click(function(){
        
        if($(".menu-list").css("display") === "none"){
            
            $('.menu-list').show('slow');
            $('.main').animate({'margin-right': '320px'},'fast');
        }
        
        else {
            //$('.menu-list').animate({width: '0'});
            $('.menu-list').hide('slow');
            $('.main').animate({'margin-right': '0px'},'fast');
            
        }
    });
}
$(document).ready(function(){
    //prepopulateBoard();
    //createBoard();
    openMenu();
});   

    
        
