var serverURL = 'http://localhost:3000';

$(document).ready(function(){
$('.sign-out').on('click', function(){
    $.ajax({
        url: serverURL + '/create/signout',
        type: 'GET',
        dataType: 'json',
        success: function(response){
            console.log('SIGNED OUT');
            window.location = response.redirect;
        }
    });
});

$('.nav-board').on('click', function(){
    $('.nav-board-menu').toggle();
});

$('.nav-create-board').on('click', function(e){

    e.preventDefault();
    var inputBox = $('.nav-create-text');
    var inputText = inputBox.val().trim();

    if(inputBox.is(':visible') && inputText !== ''){
        var newForm = $('<form>');

        var newButton = $('<button>').attr('class','board');

        newButton.text(inputText);

        newForm.append(newButton);

        $('.nav-board-buttons').append(newForm);

        $.ajax({
            url: serverURL + '/boardManager',
            type: 'POST',
            data: {
                title: inputText,
                lists: []
            },
            success: function(){

            }
        });
    }
    inputBox.val('');
    inputBox.toggle();
    //newBoard.focus();
});

$('.nav-home').on('click', function(){
    window.location = '/boards';
});
});
