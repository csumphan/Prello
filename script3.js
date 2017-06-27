//html elements that are already on page
var lol = $('.lol');
var addList = document.querySelector("#addList");
var bg = document.querySelector(".bg");

//data structure that holds the lists of list and cards
//example structure: [[card1,card2,card3],[],[card1,card2]]
//outer list represents the list of lists
//inner list represent a list
//card1 represents a card object which includes the mini card and
//modal card.
var listOfList = [];

//

$('.lol').on('click',".list-close", function(e){
    if(confirm("Warning! Are you sure you want to delete this list?" + e.target.classList)) {
        
        console.log("attr.id: " + e.target.parentElement.id);
        var index = getListId(e.target.parentElement.id);
        var lid = e.target.parentElement.id;
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
        //delete list from api
        $.ajax({
            url:'http://thiman.me:1337/csumphan/list',
            type: 'GET',
            dataType: 'json',
            success: function(json) {
                for(var x = 0; x < json.length; x++) {

                    if(json[x].lid === lid) {
                        var apiListID = json[x]._id;
                        console.log("WE GOT LID " + apiListID);
                        
                        $.ajax({
                            url: 'http://thiman.me:1337/csumphan/list/' +apiListID,
                            type: 'DELETE',
                            dataType: 'json',
                            success: function(){console.log("DELETED")}
                        });
                    }
                    else if(getListId(json[x].lid) > getListId(lid)) {
                        var apiListID = json[x]._id;
                        
                        $.ajax({
                            url: 'http://thiman.me:1337/csumphan/list/' +apiListID,
                            type: 'PATCH',
                            data: {
                                lid: 'list-' + (getListId(json[x].lid)-1)
                            },
                            dataType: 'json',
                            success: function(){console.log('updated')}
                        });
                    }
                }
            }
        });

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
    var miniCard = createMiniCard(listID, cardIndex);
    
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
    
    $.ajax({
        url: 'http://thiman.me:1337/csumphan/list',
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for(var x = 0; x < json.length; x++) {
                if(e.target.parentElement.id === json[x].lid){
                    var jsonListID = json[x]._id;
                    
                    $.ajax({
                        url: 'http://thiman.me:1337/csumphan/list/'+ jsonListID + '/card',
                        type: 'POST',
                        data: {
                            cid: 'card-' + listID + '-' + cardIndex,
                            title: $('#' + modalCard.id + ' .title').val(),
                            labels: [['','']],
                            dueDate: '',
                            members: [''],
                            description: ''
                        },
                        dataType: 'json',
                        success: function(){
                            $.ajax({
                                url: 'http://thiman.me:1337/csumphan/list',
                                type: 'GET',
                                dataType: 'json',
                                success: function(json) {
                                    var lastCard = json[x].cards.length-1;
                                   
                                    var apiCardID = json[x].cards[lastCard]._id;
                                    
                                    $(modalCard).addClass(apiCardID);
                                }
                                    
                            });
                        }
                    });
                    
                    break;
                }
            }
        }
        
    });
    

    miniCard.addEventListener('click',function(){
        modalCard.style.display = "block";
        bg.style.display = "block";

        bgGetID(modalCard.id);
    });

    //append card into a list in a list
    listOfList[listID].push(card);
});

addList.addEventListener('click', function(){
    var newList = createList();

    $.ajax({
        url: 'http://thiman.me:1337/csumphan/list',
        type: 'POST',
        data: {
            title: $('#' + newList.id + ' .list-title').val(),
            lid: newList.id
        },
        dataType: 'json',
        success: function(){console.log("OK")}
    });
    
});

bg.addEventListener("click", function() {
    bg.style.display = "none";
    var cardIndex = getCardID(bg.id);
    console.log(cardIndex);
    listOfList[cardIndex[0]][cardIndex[1]].modalView.style.display = "none";
    
});

$('.lol').on("submit", '.list-form', function(e){
    e.preventDefault();
    $(this).children()[0].blur();
    
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

function getClassList(c) {
    return c.trim().split(' ');
}

function getAPICardID(c) {
    var classList = getClassList(c);
    
    return classList[1];
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
        
        $.ajax({
            url: 'http://thiman.me:1337/csumphan/list',
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];
                        console.log(card.className);
                        console.log("APIIIIII: " + getAPICardID(card.className));
                        //console.log()
                        $.ajax({
                            url: 'http://thiman.me:1337/csumphan/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: newTitle.value,
                                dueDate: json[x].cards[cardIndex].dueDate,
                                labels: json[x].cards[cardIndex].labels,
                                members: json[x].cards[cardIndex].members,
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: json[x].cards[cardIndex].description               
                            },
                            dataType: 'json',
                            success: function(){console.log('TITLE CHANGE SUCCESS');}
                        });
                        break;
                }
            }
        }
        });
        
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
        
        $.ajax({
            url: 'http://thiman.me:1337/csumphan/list',
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];
                        console.log(card.className);
                        console.log("APIIIIII: " + getAPICardID(card.className));
                        //console.log()
                        $.ajax({
                            url: 'http://thiman.me:1337/csumphan/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: json[x].cards[cardIndex].title,
                                dueDate: formatDate,
                                labels: json[x].cards[cardIndex].labels,
                                members: json[x].cards[cardIndex].members,
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: json[x].cards[cardIndex].description               
                            },
                            dataType: 'json',
                            success: function(){console.log('DATE CHANGE SUCCESS');}
                        });
                        break;
                }
            }
        }
        });

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
    labelB.innerHTML = "Add Label";
    
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
        labelPickerInput.value = '';
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
            
            $.ajax({
            url: 'http://thiman.me:1337/csumphan/list',
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];
                        var newLabelList = json[x].cards[cardIndex].labels;
                        var colorClass = newLabel.classList[1];
                        
                        if(newLabelList[0][0] === '') {
                            newLabelList[0][0] = colorClass;
                            newLabelList[0][1] = newLabel.innerHTML;
                        }
                        else {
                            newLabelList.push([colorClass,newLabel.innerHTML])
                        }
                        
                        $.ajax({
                            url: 'http://thiman.me:1337/csumphan/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: json[x].cards[cardIndex].title,
                                dueDate: json[x].cards[cardIndex].dueDate,
                                labels: newLabelList,
                                members: json[x].cards[cardIndex].members,
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: json[x].cards[cardIndex].description             
                            },
                            dataType: 'json',
                            success: function(){console.log('DESCRIPTION CHANGE SUCCESS');}
                        });
                    }
                }
            }
            });
            
            labelPickerInput.value = '';
            
            
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
    
    var selectedMember = document.createElement('ul');
    selectedMember.className += " selected-label label-container inline";
    
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
    modalMember.appendChild(selectedMember);
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
        $(this).prev()[0].focus();
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
            var splitID = getCardID(card.id);
            listOfList[splitID[0]][splitID[1]].miniView.parentNode.removeChild(listOfList[splitID[0]][splitID[1]].miniView);
          document.querySelector('body').removeChild(listOfList[splitID[0]][splitID[1]].modalView);
            ////
//            $.ajax({
//            url:'http://thiman.me:1337/csumphan/list',
//            type: 'GET',
//            dataType: 'json',
//            success: function(json) {
//                for(var x = 0; x < json.length; x++) {
//
//                    if(json[x].lid === ('list-'+splitID[0])) {
//                        var apiListID = json[x]._id;
//                        console.log("WE GOT LID " + apiListID);
//                        
//                        var jsonCards = json[x].cards;
//                        for(var y = 0; y <jsonCards.length; y++) {
//                            var apiCardID = jsonCards[y]._id;
//                            
//                            if(jsonCards[y].cid === ('card-'+splitID[0]+'-'+splitID[1]))
//                            $.ajax({
//                                url: 'http://thiman.me:1337/csumphan/list/' +apiListID+'/'+card+'/'+apiCardID,
//                                type: 'DELETE',
//                                dataType: 'json',
//                                success: function(){console.log("DELETED")}
//                        });
//                            
//                            else if (getCardID(jsonCards[y].cid)[1] > splitID[1]) {
//                                $.ajax({
//                                url: 'http://thiman.me:1337/csumphan/list/' +apiListID+'/'+card+'/'+apiCardID,
//                                type: 'PATCH',
//                                data: {
//                                    cid: 
//                                },
//                                dataType: 'json',
//                                success: function(){console.log("DELETED")}
//                            }
//                                
//                        }
//                        
//                        
//                        break;
//                    }
//                    else if(getListId(json[x].lid) > getListId(lid)) {
//                        var apiListID = json[x]._id;
//                        
//                        $.ajax({
//                            url: 'http://thiman.me:1337/csumphan/list/' +apiListID,
//                            type: 'PATCH',
//                            data: {
//                                lid: 'list-' + (getListId(json[x].lid)-1)
//                            },
//                            dataType: 'json',
//                            success: function(){console.log('updated')}
//                        });
//                    }
//                }
//            }
//        });
//            ////
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
        
        console.log($(this).parent().parent().attr('class'))
        //if the li is from the member picker section
        if($(this).parent().parent().hasClass('member-list')) {
            $(this).remove();
        }
        //if the li is from the label picker section
        else {
            var splitID = getCardID(card.id);
            var mini = "#miniCard-" + splitID[0] + "-" + splitID[1];
            var labelIndex = $(this).index();


            $(mini + " ul").children()[labelIndex].remove();
            $(this).remove();
        }
        
        
    });
    
    $('.label-form').on('submit',function(e){
        e.preventDefault();
    });
    
    $('.member-form').on('submit',function(e){
        e.preventDefault();
        //get value from input of card that triggered
        //insert into same card a label of the input
        //console.log($(this).children()[0].value);
        
        if($(this).children()[0].value !== '') {
            var memName = $(this).children()[0].value;
            var newMember = $('<li>', {"class": "label click"});
            newMember.text(memName);
            //console.log($(this).parent)
            $(this).parent().prev().append(newMember);
            
            $.ajax({
            url: 'http://thiman.me:1337/csumphan/list',
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];
                        console.log(card.className);
                        console.log("APIIIIII: " + getAPICardID(card.className));
                        var newMemList = json[x].cards[cardIndex].members;
                        if(newMemList[0] === '') {
                            newMemList[0] = memName;
                        }
                        else {
                            newMemList.push(memName);
                        }
                        
                        $.ajax({
                            url: 'http://thiman.me:1337/csumphan/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: json[x].cards[cardIndex].title,
                                dueDate: json[x].cards[cardIndex].dueDate,
                                labels: json[x].cards[cardIndex].labels,
                                members: newMemList,
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: json[x].cards[cardIndex].description             
                            },
                            dataType: 'json',
                            success: function(){console.log('DESCRIPTION CHANGE SUCCESS');}
                        });
                    }
                }
            }
            });

            $(this).children()[0].value = '';
        }
    });
    
    $('.description-input').on('focusin', function(e){
        $(this).val($(this).prev()[0].innerHTML);
        
        console.log($(this).prev()[0]);
        $(this).prev()[0].innerHTML = '';
        
        
    });
    
    $('.description-input').on('focusout', function(e){
        
        var newDescription = $(this).val();
        console.log($(this).prev());
        
        console.log($(this).val());
        
        $(this).prev()[0].innerHTML = $(this).val();
        
        $.ajax({
            url: 'http://thiman.me:1337/csumphan/list',
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];
                        console.log(card.className);
                        console.log("APIIIIII: " + getAPICardID(card.className));
                        //console.log()
                        $.ajax({
                            url: 'http://thiman.me:1337/csumphan/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: json[x].cards[cardIndex].title,
                                dueDate: json[x].cards[cardIndex].dueDate,
                                labels: json[x].cards[cardIndex].labels,
                                members: json[x].cards[cardIndex].members,
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: newDescription              
                            },
                            dataType: 'json',
                            success: function(){console.log('DESCRIPTION CHANGE SUCCESS');}
                        });
                        break;
                }
            }
        }
        });
        
        $(this).css('display', 'none');

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

//creates a new list and returns a reference to the list
function createList(hasTitle=false, newTitle='') {
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
    
    
    //set list title
    if(hasTitle) {
        listInput.value = newTitle;
    }
    else {
        listInput.value = "Title " + listOfList.length; 
    }
    
    
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
    
    return newList;
}

function createMiniCard(listID,cardIndex) {
    
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
    var cardListSelector = "#list-" + listID + " .card-list";
    
    $(cardListSelector).append(miniCard);
    
    return miniCard;
}
    

$(document).ready(function(){
    $.ajax({
        url: 'http://thiman.me:1337/csumphan/list',
        type: 'GET',
        dataType: 'json',
        success: function(json) {
            var listPos = 0;
            
            //traverse through json backwards since first list is in
            //the last position
            for(var x = 0; x < json.length; x++) {
                //create all list in json
                var newList = createList(true, json[x].title);
                var newListIndex = getListId(newList.id);
                
                var cardList = json[x].cards;
                for (var y = 0; y < cardList.length; y++) {
                    var modalCard = createCard(newListIndex,y);
                    $(modalCard).addClass(cardList[y]._id);
                    var miniCard = createMiniCard(newListIndex,y);
                    
                    var modalID = '#' + modalCard.id;
                    var miniID = '#' + miniCard.id;
                    
                    //set title on mini and modal card
                    $(modalID + " .title").val(cardList[y].title);
                    $(miniID + ' div').text(cardList[y].title);
                    
                    //set date on modal card
                    $(modalID + ' .date-text').append(cardList[y].dueDate);
                    
                    var colors = cardList[y].labels;
                    console.log(colors);
                    //var names = cardList[y].labelsName;
                    if(colors[0][0] === '' && colors[0][1] === '') {}
                    else{
                        for(var i = 0; i < colors.length; i++) {

                            var classColor = colors[i][0];
                            var newLabel = $('<li>').attr('class', 'label click ' + classColor);
                            var newMiniLabel = $('<li>').attr('class', 'label click label-sm ' + classColor);

                            newLabel.append(colors[i][1]);

                            console.log(colors);

                            $(modalID + ' .modal-label' +' .selected-label').append(newLabel);

                            $(miniID + ' .label-container').append(newMiniLabel);
                        }
                    }
                
                    var members = cardList[y].members;
                    
                    if(members[0] === '') {}
                    
                    else{
                        for(var i = 0; i < members.length; i++) {

                            var newLabel = $('<li>').attr('class', 'label click');

                            newLabel.append(members[i]);

                            $(modalID + ' .member-list' +' .selected-label').append(newLabel);
                        }
                    }
                    
                    $(modalID + ' .description-text').append(cardList[y].description);
                    
                    listOfList[newListIndex].push({miniView: miniCard, modalView: modalCard});
                 }
                
            }
        }
    });
    
    //prepopulateBoard();
    //createBoard();
    openMenu();
});   

    
        
