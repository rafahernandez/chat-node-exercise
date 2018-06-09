var socket = io();
function scrollToBottom() {
  var messages = $('#messages');  
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('hh:mm:ss'); 
  var template = $('#message-template').html();
  var html = Mustache.render(template,{
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('hh:mm:ss'); 

  var formattedTime = moment(message.createdAt).format('hh:mm:ss');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
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