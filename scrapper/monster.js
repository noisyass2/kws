var cheerio = require('cheerio');
var request = require('request');
var utils = require('../utils/util');
var fs = require('fs');

function scrapMonsterUrls(url,next) {
    var urls = [];
    request(url,(err,req,html) => {
        if(err) throw err;
        var $ = cheerio.load(html);
        $("div.card-block>div.table-responsive>table>tbody>tr>td>a").each((i,el) => {
            var a = $(el);
            urls.push(a.attr('href'));
        });
        console.log(urls);
        next(urls);
    })
}


function scrapMonster(url,next) {
    request(url,(err,req,html) => {
        if(err) throw err;

        var $ = cheerio.load(html);
        var monName = utils.getNames($,"h2>ruby>rt");
        var mon = mons.findOne("name",monName.jpName);

        if(mon){
            // get Items
            mon.items = getItems($);
            mon.enName = monName.enName;
            mons.save("monster.json");
        }
        
    })
}

function getItems($){
    ranks = [ "Low Rank","High Rank","G Rank" ];
    var items =[];
    ranks.forEach(rank => {
        var rankItems = getItemsByRank(rank,$);
        //console.log(rankItems);
        items = items.concat(rankItems);
    });

    return items;
}

function getItemsByRank(rank,$){
    //get table.
    var items = [];
    var conts = $("h6:contains(" + rank + ")").each((i,el) => {
        var div = $(el).parent();
        //rows
        
        $("tr",div).each( (i , trEl) => {
            var tr = $(trEl);
            var tds = $("td",tr);
            if(tds.length == 1) { // new subcat 
                cat = tds.first().text().trim();
            }else{
                var item = { 
                    rank: rank,
                    cat : cat,
                    item : tds.first().text().trim(),
                    val : tds.last().text().trim()
                }
                items.push(item);
            }
            
        });
    });
    return items;
}

var mons = [];
function run() {
    // https://mhxxx.kiranico.com/mon/60e36
    mons = JSON.parse(fs.readFileSync('monspawn.json'));
    scrapMonsterUrls("https://mhxxx.kiranico.com/mon", (urls) => {
        urls.forEach(url => {
            scrapMonster(url,e => { console.log(url + " done.") });
        });
    });
    
}

run();
