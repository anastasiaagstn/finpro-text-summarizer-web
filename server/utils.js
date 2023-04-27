module.exports.objectSumValue = function(obj) {
  var sum = 0;
  for( var el in obj ) {
    if( obj.hasOwnProperty( el ) ) {
      sum += parseFloat( obj[el] );
    }
  }
  return sum;
}


module.exports.getBody = function(data) {
  const request = data;
  return request.body;
}