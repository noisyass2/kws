var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var utils = require('../utils/util');


function scrapSkills(url,next) {
    request(url,(err,req,html) => {
        var $ = cheerio.load(html);
        // get all rows
        var skills = [];
        var lastSkill = {};
        $("div.card-block>div.table-responsive>table>tbody>tr").each((i,el) => {
            var row = $(el);
            
            var skillCol = $("td:nth-child(1)",row);
            // check if new skill
            if($("a>ruby>rt",skillCol).length > 0){
                var newSkill = {
                    name : utils.getNames($,$("a>ruby>rt",skillCol)),
                    effect: utils.getNames($,$("rt",$("td:nth-child(2)"))),
                    desc : $("td:nth-child(4)",row).text().trim()
                }

                lastSkill = newSkill;
                if(newSkill.desc){                    
                    skills.push(lastSkill);
                }
            }else{
                var newSkill = {
                    name: lastSkill.name,
                    effect: utils.getNames($,$("rt",skillCol)),
                    desc: $("td:nth-child(3)",row).text().trim()
                }
                skills.push(newSkill);
            }
        });
        next(skills);
    })
}


function run() {
    // scrap here
    var url = "https://mhxxx.kiranico.com/skill";
    scrapSkills(url,(res) => {
        console.log(res);
        res.save("skills.json")
    })
}


run();