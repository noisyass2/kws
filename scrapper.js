var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

function getSpawn(url,next){
    request(url, function(err,resp,html){
        if(!err){
            var ms = [];
            var $ = cheerio.load(html);
            // get habitat
            var habitatTable = $('h3:contains(生息地)').next();
            // console.log(habitatTable);
            if(habitatTable){
                $('table>tbody>tr',habitatTable).each(function(err) {
                    var row = $(this);
                    // console.log($(row).text());
                    // console.log($('td:nth-child(1)',row).text() + ":" + $('td:nth-child(2)',row).text() + ' > ' + 
                    //     $('td:nth-child(3)',row).text() + ' > ' + $('td:nth-child(4)',row).text());
                    if($('td:nth-child(1)',row).text()){
                        var m = { 
                            map : $('td:nth-child(1)',row).text(),
                            spawn: $('td:nth-child(2)',row).text() + ' > ' + 
                            $('td:nth-child(3)',row).text() + ' > ' + $('td:nth-child(4)',row).text()
                        };

                        ms.push(m);
                    }
                })
                // console.log($('table>tbody>tr>td:nth-child(1)',habitatTable).text());
            }

            next(ms);
        }
        
    });
}

function getTable(url,next){
    var url = "http://wiki.mhxg.org/data/2501.html";

    request(url, function(err,resp,html) {
        var $ = cheerio.load(html);
        if(!err){
            $("table>tbody>tr>td>a").each(function(err){
                var a = $(this);
                // console.log(a.href);
                next(a);
                
            });
        }
    } )
}

function add(mon){
    var matches = mons.filter(spwn => mon.name === spwn.name);
    if(matches.length == 0){
        mons.push(mon);
        save(mons);
    }
    
}
function save(ms){
    fs.writeFileSync('monspawn.json',JSON.stringify(ms));
}
// var url = "http://wiki.mhxg.org/data/1966.html#id182531";
// getSpawn(url,(q) => {
//     console.log(q);
// });
var url = "http://wiki.mhxg.org/data/2501.html";
var mons = [];
getTable(url,(a) => { 
    console.log(a.text());
    var monName = a.text();
    var monUrl  = "http://wiki.mhxg.org/" + a.attr('href');

    console.log(monUrl);
    getSpawn(monUrl,(qqq) => {
        // console.log(qqq);
        var mon = { name: monName,spawn: qqq };
        console.log(mon);
        add(mon);
        
    });
});

