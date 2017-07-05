var passwordField = document.querySelector("#password-create");
var confirmField = document.querySelector("#confirm-create");

var serverURL = 'http://localhost:3000';


function createAccountObject(form){
    var formItems = form.serializeArray();
    var acc = {};

    for(var x = 0; x < formItems.length-1; x++) {
        var field = formItems[x];

        acc[field.name] = field.value;
    }

    return acc;
}

$(document).ready(function(){
    $('#create-account').on('submit', function(e){
        e.preventDefault();

        if (passwordField.value !== confirmField.value) {
            alert('Passwords do not match');
        }
        else {
            var newAcc = createAccountObject($(this));

            $.ajax({
                url: serverURL + '/create',
                type: 'POST',
                data: newAcc,
                dataType: 'json',
                success: function(){
                    console.log('ACCOUNT CREATED');
                }
            });

            $('#create-account .textbox').val('');

        }
    });

    // $('#login').on('submit', function(e){
    //     e.preventDefault();
    //     var user = $('#login-user').val();
    //     var pass = $('#login-pass').val();
    //
    //     $.ajax({
    //         url: serverURL + '/zzz',
    //         type: 'POST',
    //         data: {
    //             username: user,
    //             password: pass,
    //         },
    //         dataType: 'json',
    //         success: function(data){
    //
    //             //window.location = data.redirect;
    //         }
    //     });
    // });
});





// success: function(json){
//     for(var x = 0; x < json.length; x++) {
//         if(json[x].username === user) {
//             if(json[x].password === pass){
//                 console.log("You're in");
//             }
//             break;
//         }
//         if(x === json.length-1){
//             console.log('Invalid username or password');
//         }
//     }
// }
