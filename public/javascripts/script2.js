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

    // $('.board-list').on('click', 'li', function(){
    //     $.ajax({
    //         url: serverURL + '/board',
    //         type: 'GET',
    //         dataType: 'json',
    //         async:false,
    //     });
    // });
});
