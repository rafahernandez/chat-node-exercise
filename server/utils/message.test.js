var expect = require('expect');

var { generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jen';
    var text = 'Some message';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location message object', () => {
    var from = 'Jen';
    var lat = '19';
    var lon = '-98';
    var url = 'https://www.google.com.mx/maps?q=19,-98';
    var message = generateLocationMessage(from, lat, lon);

    expect(message.createdAt).toBeA('number');
    expect(message.lat).toBeA('number');
    expect(message.long).toBeA('number');
    expect(message).toInclude({ from, lat, long });
  });
});