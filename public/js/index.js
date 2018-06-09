var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('hh:mm:ss'); 
  let li=$('<li></li>')
  li.text(`[${formattedTime}] ${message.from}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('hh:mm:ss'); 
  let li = $('<li></li>')
  let a = $('<a target="_blank">My current location</a>');
  li.text(`[${formattedTime}] ${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
});


$('#message-form').on('submit', function (e) {
  e.preventDefault();
  var msgTextbox = '[name=message]';
  socket.emit('createMessage',{
    from: 'Anon', 
    text: $(msgTextbox).val()
  }, function(){
    $(msgTextbox).val('');
  });
});

var locationButton=$('#send-location');
locationButton.on('click', function () {
  
  if(!navigator.geolocation){
    return alert('Geolocation not supported by browser.');
  }
  //TODO: loading button on click
  locationButton.attr('disabled', 'disabled').text('Enviando ...');
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Enviar ubicación ');
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Enviar ubicación ');
    alert('Unable to fetch location.');
  });

});