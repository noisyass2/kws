var fs = require('fs');

var q = {
    getNames: function($,rt){
        // get english
        var enName = $(rt).text();
        var fName = $(rt).parent().text();
        var jpName = fName.replace(enName,"");

        return {enName: enName, jpName: jpName};
    }
}

Array.prototype.test = function() {
    console.log("TEST" + this.length);
}

Array.prototype.findOne = function(prop,search){
    var matches = this.filter(el => el[prop].trim().toLowerCase() === search.trim().toLowerCase() );
    if(matches.length === 1) return matches[0];
    return null;
}

Array.prototype.save = function(path){
    fs.writeFileSync(path,JSON.stringify(this));
}

Array.prototype.load = function(path){
    this.concat(JSON.parse(fs.readFileSync(path)));
}

module.exports = q;