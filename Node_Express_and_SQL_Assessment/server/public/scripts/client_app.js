//var animalArray = [];

$(document).ready(function() {

  $('#submit-button').on('click', postData);

});

function postData() {
    event.preventDefault();

    var values = {};
    $.each($('#sql-form').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });

    console.log(values);

    //clears out the form
    $('#sql-form').find('input[type=text]').val('');
      //animalArray.push(values);

    $.ajax({
        type: 'POST',
        url: '/zoo_animals',
        data: values,
        success: function(data) {
            if(data) {
                // everything went ok
                console.log('from server:', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });

}

function getData() {
    $.ajax({
        type: 'GET',
        url: '/zoo_animals',
        success: function(data) {
            console.log(data);
            if(data) {
                // everything went ok
                for(var i = 0; i <=data.length; i++) {
                  $('.container').append('<div>' +
                  '<b>First Name:</b> ' + data[i].animal + '\n' +
                  '<b>| Last Name:</b>  ' + data[i].animal_count + '\n' + '<br>');
                }
            } else {
                console.log('error');
            }
        }
    });
}
