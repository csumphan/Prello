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

    $('.add-board').on('click', function(e){

        e.preventDefault();

        var newBoard = $('<li>');
        var newForm = $('<form>');

        var newButton = $('<button>').attr('class','board');
        newButton.text('Board 1');

        newForm.append(newButton);
        newBoard.append(newForm);

        $('.boards').prepend(newBoard);

        $.ajax({
            url: serverURL + ''
        });
    });
});
