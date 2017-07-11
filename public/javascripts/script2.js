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

    $('.delete-board').on('click', function(){
        $('.board-list .board').toggleClass('delete-border');
        $('.add-board-title').removeClass('visible');

        if($('.board-list .board').hasClass('delete-border')){

            $('.board-list .board').on('click',function(e){
                e.preventDefault();
                var url = $(this).attr('formaction');
                var bid = url.split('/')[2];

                $.ajax({
                    url: serverURL + '/boardManager/' + bid,
                    type:'GET',
                    dataType: 'json',
                    success: function(json){
                        console.log(json);
                        for(var x = 0; x < json.length; x++){
                            $.ajax({
                                url: serverURL + '/list/' + json[x]._id,
                                type: 'DELETE',
                                dataType: 'json'
                            });
                        }
                        $.ajax({
                            url: serverURL + '/boardManager/' + bid,
                            type: 'DELETE',
                            dataType: 'json',
                        });
                    }
                });



                $(this).parent().parent().remove();
            });
        }
    });

    $('.add-board').on('click', function(e){

        e.preventDefault();
        var inputBox = $('.add-board-title');
        var inputText = inputBox.val().trim();

        if(inputBox.hasClass('visible') && inputText !== ''){

            var newBoard = $('<li>');
            var newForm = $('<form>');

            var newButton = $('<button>').attr('class','board');

            newButton.text($('.add-board-title').val());

            newForm.append(newButton);
            newBoard.append(newForm);

            $('.boards').append(newBoard);

            $.ajax({
                url: serverURL + '/boardManager',
                type: 'POST',
                data: {
                    title: $('.add-board-title').val(),
                    lists: []
                },
                success: function(){
                    location.reload();
                }
            });
        }
        $('.add-board-title').toggleClass('visible');
        //newBoard.focus();
    });

    $('.add-board-title').on('submit', function(e){
        e.preventDefault();

        var newBoard = $('<li>');
        var newForm = $('<form>');

        var newButton = $('<button>').attr('class','board');
        newButton.text($('.add-board-title').val());

        newForm.append(newButton);
        newBoard.append(newForm);

        $('.boards').append(newBoard);

        $.ajax({
            url: serverURL + '/boardManager',
            type: 'POST',
            data: {
                title: $(this).val(),
                lists: []
            },
            success: function(){
                location.reload();
            }
        });
    });

    //$('.boards').on('click', '')


});
