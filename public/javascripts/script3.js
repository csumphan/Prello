//html elements that are already on page
var lol = $('.lol');
var addList = document.querySelector("#addList");
var bg = document.querySelector(".bg");
var serverURL = 'http://localhost:3000';
var bid = $('meta[name=bid]').attr("content");

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


        var index = getListId(e.target.parentElement.id);
        var lid = e.target.parentElement.id;
        //remove modal cards from html
        for(var x = 0; x < listOfList[index].length; x++) {  document.querySelector('body').removeChild(listOfList[index][x].modalView);
        }

        //removes mini card and list from html
        //newList.parentElement.removeChild(newList);
        $("#" + e.target.parentElement.id).remove();

        //updates list id after deleted list to be one less

        for(var x = index+1; x < listOfList.length; x++) {
            document.getElementById("list-" + x).id =
                "list-" + (x-1);
        }
        //delete list from api


        $.ajax({
            url: serverURL + '/boardManager/' + bid,
            type: 'GET',
            dataType: 'json',
            success: function(json) {
                for(var x = 0; x < json.length; x++) {

                    if(json[x].lid === lid) {
                        var apiListID = json[x]._id;

                        $.ajax({
                            url: serverURL + '/boardManager/' + bid + '/list/' + apiListID,
                            type: 'DELETE',
                            dataType: 'json',
                            success: function(){}
                        });

                        $.ajax({
                            url: serverURL + '/list/' +apiListID,
                            type: 'DELETE',
                            dataType: 'json',
                            success: function(){}
                        });
                    }
                    else if(getListId(json[x].lid) > getListId(lid)) {
                        var apiListID = json[x]._id;

                        $.ajax({
                            url: serverURL + '/list/' +apiListID,
                            type: 'PATCH',
                            data: {
                                lid: 'list-' + (getListId(json[x].lid)-1)
                            },
                            dataType: 'json',
                            success: function(){}
                        });

                        for(var cardIndex = 0; cardIndex < json[x].cards.length; cardIndex++){

                            var currentCard = json[x].cards[cardIndex];

                            var splitID = getCardID(currentCard.cid);
                            var newCID = 'card-' + (splitID[0] - 1) + '-' + splitID[1];

                            $.ajax({
                            url: serverURL + '/list/' + apiListID + '/card/' + currentCard._id,
                            type: 'PATCH',
                            data: {
                                title: currentCard.title,
                                description: currentCard.description,
                                cid: newCID,
                                members: JSON.stringify(currentCard.members),
                                labels: JSON.stringify(currentCard.labels),
                                dueDate: currentCard.dueDate
                            },
                            dataType: 'json',
                            sucess: function(){}
                        });
                        }

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

                listOfList[x][y].miniView.id = "miniCard-" + x + "-" + y;

                listOfList[x][y].modalView.id = "modalCard-" + x + "-" + y;
            }
        }
        }


    });

$('.lol').on('click',".card-list .mini-card", function(e){
    var splitID = getCardID(e.currentTarget.id);
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
        url: serverURL + '/boardManager/' + bid,
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for(var x = 0; x < json.length; x++) {
                if(e.target.parentElement.id === json[x].lid){
                    var jsonListID = json[x]._id;

                    $.ajax({
                        url: serverURL + '/list/'+ jsonListID + '/card',
                        type: 'POST',
                        data: {
                            cid: 'card-' + listID + '-' + cardIndex,
                            title: $('#' + modalCard.id + ' .title').val(),
                            creator: $('meta[name=username]').attr("content"),
                            labels: JSON.stringify([['','']]),
                            dueDate: '',
                            members: JSON.stringify(['']),
                            comments: JSON.stringify([['','','']]),
                            description: ''
                        },
                        dataType: 'json',
                        success: function(){
                            $.ajax({
                                url: serverURL + '/boardManager/' + bid,
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
        url: serverURL + '/list/' + $('meta[name=bid]').attr("content"),
        type: 'POST',
        data: {
            title: $('#' + newList.id + ' .list-title').val(),
            lid: newList.id
        },
        dataType: 'json',
        success: function(){}
    });

});

bg.addEventListener("click", function() {
    bg.style.display = "none";
    var cardIndex = getCardID(bg.id);
    listOfList[cardIndex[0]][cardIndex[1]].modalView.style.display = "none";

});

$('.lol').on("submit", '.list-form', function(e){
    e.preventDefault();
    $(this).children()[0].blur();

});

$('.lol').on('focusout', '.list-form', function(e){
        var listForm = this;

    $.ajax({
            url: serverURL + '/boardManager/' + bid,
            type: 'GET',
            dataType: 'json',
            success: function(json) {
                for(var x = 0; x < json.length; x++) {

                    if(json[x].lid === listForm.parentElement.id) {
                        var apiListID = json[x]._id;

                        $.ajax({
                            url: serverURL + '/list/' +apiListID,
                            type: 'PATCH',
                            data: {
                                title: $(listForm).children()[0].value
                            },
                            dataType: 'json',
                            success: function(){}
                        });

                        break;
                    }
                }
            }
        });
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

    var creatorHeader = document.createElement('h4');
    creatorHeader.className += ' creator-header';
    creatorHeader.innerHTML = $('meta[name=username]').attr("content");

    //adds eventlistener to title
    titleF.addEventListener('focusout',function(){
        if(newTitle.value === "") {
            newTitle.value = "Title";
        }
        listOfList[listID][cardIndex].miniView.firstChild.innerHTML = newTitle.value;

        $.ajax({
            url: serverURL + '/boardManager/' + bid,
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];
                        $.ajax({
                            url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: newTitle.value,
                                dueDate: json[x].cards[cardIndex].dueDate,
                                labels: JSON.stringify(json[x].cards[cardIndex].labels),
                                members: JSON.stringify(json[x].cards[cardIndex].members),
                                comments: JSON.stringify(json[x].cards[cardIndex].comments),
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: json[x].cards[cardIndex].description
                            },
                            dataType: 'json',
                            success: function(){
                            }
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
    modalHeader.appendChild(creatorHeader);

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
            url: serverURL + '/boardManager/' + bid,
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];

                        $.ajax({
                            url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: json[x].cards[cardIndex].title,
                                dueDate: formatDate,
                                labels: JSON.stringify(json[x].cards[cardIndex].labels),
                                members: JSON.stringify(json[x].cards[cardIndex].members),
                                comments: JSON.stringify(json[x].cards[cardIndex].comments),
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: json[x].cards[cardIndex].description
                            },
                            dataType: 'json',
                            success: function(){}
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
    selectedLabel.className += " label-container inline selected-label for-label";

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

            newLabel.className += this.className;
            newLabel.innerHTML = $(labelInput).val();
            newLabelsm.className += this.className;
            newLabelsm.className += " label-sm";


            selectedLabel.appendChild(newLabel);

            var cardId = getCardID(card.id);
            var miniCard = listOfList[cardId[0]][cardId[1]].miniView;

            miniCard.lastElementChild.appendChild(newLabelsm);

            $.ajax({
            url: serverURL + '/boardManager/' + bid,
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
                            url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: json[x].cards[cardIndex].title,
                                dueDate: json[x].cards[cardIndex].dueDate,
                                labels: JSON.stringify(newLabelList),
                                members: JSON.stringify(json[x].cards[cardIndex].members),
                                comments: JSON.stringify(json[x].cards[cardIndex].comments),
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: json[x].cards[cardIndex].description
                            },
                            dataType: 'json',
                            success: function(){}
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
    selectedMember.className += " selected-label label-container inline for-member";

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

    var modalComment = document.createElement('div');
    modalComment.className += ' comment-section';

    var commentTitle = document.createElement('h3');
    commentTitle.innerHTML = "Comment";

    var commentEdit = document.createElement('textarea');
    commentEdit.className += "comment-input";
    commentEdit.rows = 3;

    var commentButton = document.createElement('div');
    commentButton.className += " comment-button button";
    commentButton.innerHTML = "Comment";

    var commentList = document.createElement('ul');

    // var comment = document.createElement('li');
    // comment.className += ' comment';
    //
    // var commentUser = document.createElement('h4');
    // commentUser.innerHTML = '300man33';
    // commentUser.className = ' comment-user inline';
    //
    // var commentDate = document.createElement('p');
    // commentDate.innerHTML = 'Jan 24, 2017 7:12pm';
    // commentDate.className = ' comment-date inline';
    //
    // var commentText = document.createElement('p');
    // commentText.innerHTML = 'blah blhaa adf defasd dsfd';
    // commentText.className += ' comment-text';
    //
    // comment.appendChild(commentUser);
    // comment.appendChild(commentDate);
    // comment.appendChild(commentText);
    //
    // commentList.appendChild(comment);

    modalComment.appendChild(commentTitle);
    modalComment.appendChild(commentEdit);
    modalComment.appendChild(commentButton);
    modalComment.appendChild(commentList);

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
            $.ajax({
            url: serverURL + '/boardManager/' + bid,
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];

                        $.ajax({
                            url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'DELETE',
                            dataType: 'json',
                            success: function() {}
                        });


                        for(var current = cardIndex+1; current < json[x].cards.length; current++) {

                            var newCID = 'card-' + listID + '-' + (current-1);

                            $.ajax({
                                url: serverURL + '/list/' + json[x]._id + '/card/' + json[x].cards[current]._id,
                                type: 'PATCH',
                                data: {
                                    title: json[x].cards[current].title,
                                    dueDate: json[x].cards[current].dueDate,
                                    labels: JSON.stringify(json[x].cards[current].labels),
                                    members: JSON.stringify(json[x].cards[current].members),
                                    cid: newCID,
                                    _id: json[x].cards[current]._id,
                                    description: json[x].cards[current].description
                                    },
                                dataType: 'json',
                                success: function(){}
                        });
                        }
                        break;
                    }
                }
            }
            });
            ////
            listOfList[splitID[0]].splice(splitID[1],1);

            for(var x = splitID[1]; x < listOfList[splitID[0]].length; x++){
                listOfList[splitID[0]][x].miniView.id = "miniCard-" + splitID[0] + "-" + x;

                listOfList[splitID[0]][x].modalView.id = "modalCard-" + splitID[0] + "-" + x;
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
    card.appendChild(modalComment);
    card.appendChild(modalFooter);

    document.querySelector('body').appendChild(card);

    $('#' + card.id + ' .for-label').on('click','li',function(e){
        console.log("this: " + this.parentElement);

        var labelIndex = $(this).index();
        //if the li is from the label picker section

        var splitID = getCardID(card.id);
        var mini = "#miniCard-" + splitID[0] + "-" + splitID[1];

        $(mini + " ul").children()[labelIndex].remove();
        $(this).remove();

        $.ajax({
        url: serverURL + '/boardManager/' + bid,
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for(var x = 0; x < json.length; x++){
                if(getListId(json[x].lid) === listID){

                    var cardIndex = getCardID(card.id)[1];
                    var newLabelList = json[x].cards[cardIndex].labels;

                    if(newLabelList.length <= 1) {
                        newLabelList = [['','']];
                    }
                    else {
                        newLabelList.splice(labelIndex,1);
                    }

                    $.ajax({
                        url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                        type: 'PATCH',
                        data: {
                            title: json[x].cards[cardIndex].title,
                            dueDate: json[x].cards[cardIndex].dueDate,
                            labels: JSON.stringify(newLabelList),
                            members: JSON.stringify(json[x].cards[cardIndex].members),
                            comments: JSON.stringify(json[x].cards[cardIndex].comments),
                            cid: json[x].cards[cardIndex].cid,
                            _id: json[x].cards[cardIndex]._id,
                            description: json[x].cards[cardIndex].description
                        },
                        dataType: 'json',
                        success: function(){}
                    });
                }
            }
        }
        });




    });

    $('#' + card.id + ' .for-member').on('click', 'li', function(e){
        var labelIndex = $(this).index();

        $(this).remove();

        $.ajax({
        url: serverURL + '/boardManager/' + bid,
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for(var x = 0; x < json.length; x++){
                if(getListId(json[x].lid) === listID){

                    var cardIndex = getCardID(card.id)[1];
                    var newMemList = json[x].cards[cardIndex].members;
                    if(newMemList.length <= 1) {
                        newMemList = [''];
                    }
                    else {
                        newMemList.splice(labelIndex,1);
                    }

                    $.ajax({
                        url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                        type: 'PATCH',
                        data: {
                            title: json[x].cards[cardIndex].title,
                            dueDate: json[x].cards[cardIndex].dueDate,
                            labels: JSON.stringify(json[x].cards[cardIndex].labels),
                            members: JSON.stringify(newMemList),
                            comments: JSON.stringify(json[x].cards[cardIndex].comments),
                            cid: json[x].cards[cardIndex].cid,
                            _id: json[x].cards[cardIndex]._id,
                            description: json[x].cards[cardIndex].description
                        },
                        dataType: 'json',
                        success: function(){}
                    });
                }
            }
        }
        });

    });

    $('#' + card.id + ' .label-form').on('submit',function(e){
        e.preventDefault();
    });

    $('#' + card.id + ' .member-form').on('submit',function(e){
        e.preventDefault();
        //get value from input of card that triggered
        //insert into same card a label of the input
        console.log(card.id);

        if($(this).children()[0].value !== '') {
            var memName = $(this).children()[0].value;
            var newMember = $('<li>', {"class": "label click"});
            newMember.text(memName);

            $(this).parent().prev().append(newMember);

            $.ajax({
            url: serverURL + '/boardManager/' + bid,
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];
                        var newMemList = json[x].cards[cardIndex].members;
                        if(newMemList[0] === '') {
                            newMemList[0] = memName;
                        }
                        else {
                            newMemList.push(memName);
                        }

                        $.ajax({
                            url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: json[x].cards[cardIndex].title,
                                dueDate: json[x].cards[cardIndex].dueDate,
                                labels: JSON.stringify(json[x].cards[cardIndex].labels),
                                members: JSON.stringify(newMemList),
                                comments: JSON.stringify(json[x].cards[cardIndex].comments),
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: json[x].cards[cardIndex].description
                            },
                            dataType: 'json',
                            success: function(){}
                        });
                    }
                }
            }
            });

            $(this).children()[0].value = '';
        }
    });

    $('#' + card.id + ' .description-input').on('focusin', function(e){
        console.log(card.id);
        console.log($(this).prev()[0].innerHTML);
        $(this).val($(this).prev()[0].innerHTML);

        $(this).prev()[0].innerHTML = '';


    });

    $('#' + card.id + ' .description-input').on('focusout', function(e){

        var newDescription = $(this).val();

        $(this).prev()[0].innerHTML = $(this).val();

        $.ajax({
            url: serverURL + '/boardManager/' + bid,
            type: 'GET',
            dataType: 'json',
            success: function(json){
                for(var x = 0; x < json.length; x++){
                    if(getListId(json[x].lid) === listID){

                        var cardIndex = getCardID(card.id)[1];

                        $.ajax({
                            url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                            type: 'PATCH',
                            data: {
                                title: json[x].cards[cardIndex].title,
                                dueDate: json[x].cards[cardIndex].dueDate,
                                labels: JSON.stringify(json[x].cards[cardIndex].labels),
                                members: JSON.stringify(json[x].cards[cardIndex].members),
                                comments: JSON.stringify(json[x].cards[cardIndex].comments),
                                cid: json[x].cards[cardIndex].cid,
                                _id: json[x].cards[cardIndex]._id,
                                description: newDescription
                            },
                            dataType: 'json',
                            success: function(){}
                        });
                        break;
                }
            }
        }
        });

        $(this).css('display', 'none');

    });

    $('#' + card.id + ' .comment-button').on('click', function(e){
        var comment = document.createElement('li');
        comment.className += ' comment';

        var userName = $('meta[name=username]').attr("content");

        var today = new Date();
        var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        var commentInput = $('#' + card.id + ' .comment-input').val();

        var commentUser = document.createElement('h4');
        commentUser.innerHTML = userName;
        commentUser.className = ' comment-user inline';

        var commentDate = document.createElement('p');

        commentDate.innerHTML = dateTime;
        commentDate.className = ' comment-date inline';

        var commentText = document.createElement('p');
        commentText.innerHTML = commentInput;
        commentText.className += ' comment-text';

        comment.appendChild(commentUser);
        comment.appendChild(commentDate);
        comment.appendChild(commentText);

        $('#' + card.id + ' .comment-section ul').prepend(comment);

        $.ajax({
        url: serverURL + '/boardManager/' + bid,
        type: 'GET',
        dataType: 'json',
        success: function(json){
            for(var x = 0; x < json.length; x++){
                if(getListId(json[x].lid) === listID){

                    var cardIndex = getCardID(card.id)[1];
                    var newComList = json[x].cards[cardIndex].comments;
                    if(newComList[0][0] === '') {
                        newComList[0] = [userName,dateTime,commentInput];
                    }
                    else {
                        newComList.push([userName,dateTime,commentInput]);
                    }

                    $.ajax({
                        url: serverURL + '/list/' + json[x]._id + '/card/' + getAPICardID(card.className),
                        type: 'PATCH',
                        data: {
                            title: json[x].cards[cardIndex].title,
                            dueDate: json[x].cards[cardIndex].dueDate,
                            labels: JSON.stringify(json[x].cards[cardIndex].labels),
                            comments: JSON.stringify(newComList),
                            members: JSON.stringify(json[x].cards[cardIndex].members),
                            cid: json[x].cards[cardIndex].cid,
                            _id: json[x].cards[cardIndex]._id,
                            description: json[x].cards[cardIndex].description
                        },
                        dataType: 'json',
                        success: function(){}
                    });
                }
            }
        }
        });

        $('#' + card.id + ' .comment-input').val('');

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
        url: serverURL + '/boardManager/' + bid,
        type: 'GET',
        dataType: 'json',
        success: function(json) {
            console.log(json);
            var listPos = 0;


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

                    $(modalID + ' .creator-header').text(cardList[y].creator);

                    //set date on modal card
                    $(modalID + ' .date-text').append(cardList[y].dueDate);

                    var colors = cardList[y].labels;
                    //var names = cardList[y].labelsName;
                    if(colors[0][0] === '' && colors[0][1] === '') {}
                    else{
                        for(var i = 0; i < colors.length; i++) {

                            var classColor = colors[i][0];
                            var newLabel = $('<li>').attr('class', 'label click ' + classColor);
                            var newMiniLabel = $('<li>').attr('class', 'label click label-sm ' + classColor);

                            newLabel.append(colors[i][1]);

                            $(modalID + ' .modal-label' +' .selected-label').append(newLabel);

                            $(miniID + ' .label-container').append(newMiniLabel);
                        }
                    }

                    var comments = cardList[y].comments;

                    if(comments[0][0] === '') {}
                    else{
                        for(var i = 0; i < comments.length; i++) {
                            var newComment = $('<li>').attr('class', 'comment');
                            var commentUser = $('<h4>').attr('class', 'comment-user inline');
                            commentUser.text(comments[i][0]);

                            var commentDate = $('<p>').attr('class', 'comment-date inline');
                            commentDate.text(comments[i][1]);

                            var commentText = $('<p>').attr('class', 'comment-text');
                            commentText.text(comments[i][2]);

                            newComment.append(commentUser);
                            newComment.append(commentDate);
                            newComment.append(commentText);

                            $(modalID + ' .comment-section ul').prepend(newComment);
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
