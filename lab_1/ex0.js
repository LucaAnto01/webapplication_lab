/*Create a function that, given an array of strings, for each string computes and prints a new one composed by the first two and last two characters.
If the word is shorter than two characters, it prints an empty string. Otherwise, if the word is two or three characters long, the function prints the same character two times.*/

/**
 * Function to process a string
 * @param {[String]} strings 
 */
function processStrings(strings) {
    for (let str of strings) {
      if (str.length < 2)
        console.log("Base string: " + str + ", new string --> " + ""); //Empty string for words shorter than two characters
    
      else if (str.length <= 3) 
        console.log("Base string: " + str + ", new string --> " + str + str); //Repeat the character(s) for words of length 2 or 3

      else {
        let newString = str.substring(0, 2) + str.substring(str.length - 2);
        console.log("Base string: " + str + ", new string --> " + newString);
      }
    }
  }
  
  //Test the function with various strings
  const testStrings = ['spring', 'it', 'cat', 'abc', 'a', ''];
  processStrings(testStrings);
  