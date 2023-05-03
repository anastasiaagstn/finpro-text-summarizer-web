export default {
  // Returns a random integer from 1 to 10
  randomNumber(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
  }
};