const fs = require('fs');

fs.writeFile("./test_file.txt", "Hey there2!", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});