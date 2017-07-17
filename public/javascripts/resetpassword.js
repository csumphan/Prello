$(document).ready(function(){
    var serverURL = 'http://localhost:3000';
    $('form').on('submit', function(e){
        e.preventDefault();

        var password = $('#password-create').val();
        var confirm = $('#confirm-create').val();

        if(password !== confirm) {
            $('.password-error').show();
            this.reset();
        }

        else {
            var splitUrl = window.location.pathname.split('/');
            console.log(splitUrl[2]);
            $.ajax({
                url: serverURL + '/reset/',
                type: 'POST',
                data: {
                    password: password,
                    hid: splitUrl[2]
                },
                dataType: 'json',
                success: function(json){
                    window.location = serverURL + json.confirm
                }
            });
        }

    });

});
