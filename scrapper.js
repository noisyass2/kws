
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var utils = require('./utils/util');

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

function addMonster(mon){
    var matches = mons.filter(spwn => mon.name === spwn.name);
    if(matches.length == 0){
        mons.push(mon);
        saveMonster(mons);
    }
    
}
function saveMonster(ms){
    fs.writeFileSync('monspawn.json',JSON.stringify(ms));
}

function add(list,el,prop){
    var matches = list.filter(spwn => el[prop] === spwn[prop]);
    if(matches.length == 0){
        list.push(mon);
    }
}

function addAndSave(list,el,prop,path){
    var matches = list.filter(spwn => el[prop] === spwn[prop]);
    if(matches.length == 0){
        list.push(el);
        fs.writeFileSync(path,JSON.stringify(list));
    }
}

var processed = [];
function getArmorsetsTable(url,next) {
    //https://mhxxx.kiranico.com/bougu

    
    request(url, function(err,resp,html) {
        var $ = cheerio.load(html);
        if(!err){
            for (let i = 1; i < 12; i++) {
                var maindiv = "#blade-";
                if(i == 11) maindiv += "X"; else maindiv += i;
                $(maindiv + ">div>table>tbody>tr:not(.table-warning)>td>small>a").each(function(err){
                    var a = $(this);
                    // console.log(a.href);
                    if(!findOne(processed,"url",a.attr('href')))
                    {
                        processed.push({
                            url: a.attr('href'),
                            rank: (i == 11 ? "X" : "" + i)
                        });
                    }
                });
            }
        }
        next(processed);
    } )
}

function getArmors(url,rank,next){
    request(url, function(err,resp,html) {
        var $ = cheerio.load(html);
        var armorsForThisPage = [];
        if(!err){
            try{
                
                // Get parts
                var armorNames = [];
                $("div.row > div.col-lg-6 > div.card").each((i,el) => {
                    var card = $(el);
                    // console.log(card);
                    var enName = $("rt",card).text();
                    var fName = $("ruby",card).text();
                    var jpName = fName.replace(enName, "");
                    var armor = {
                        rank: rank,
                        enName : enName,
                        jpName : jpName
                    };
                    if(!findOne(armorsForThisPage,"enName",armor.enName)){
                        armorsForThisPage.push(armor);
                        armorNames.push(enName);
                    }
    
                });
                
                //skills
                // $("div.card-block>div.table-responsive>table>tbody>tr>td:nth-child(13)>small").first().html().split("</span>").map((t) => t.replace("\<span style=\"color\: green;\">",""))
                var tbl = $("small:contains(Blademaster)").parent().parent().parent();
                
                $("tr",tbl).each((i,el) => {
                    var row = $(el);
                    var partName = $("td:nth-child(5)",row).text();
                    var armor = findOne(armorsForThisPage, "enName",partName);
                    // console.log(partName);
                    if(armor){
                        armor.skills =  [];
                        armor.skills = getArmorSkills($,row);
                        // console.log(armor.skills);
                    }
                })
                
                // items
                var tbl2 = $("th:contains(Lv)").parent().parent().parent();

                $("tr",tbl2).each((i,el) => {
                    if(i > 1){
                        var row2 = $(el);
                        // Check number of parts
                        if($("td",row2).length == armorNames.length + 1){
                            var lvl = $("td:nth-child(1)",row2).text();
                            for (let j = 2; j < armorNames.length +2; j++) {
                                const armorName = armorNames[j-2];
                                var partsNeeded = getParts($,$("td:nth-child(" + j + ")",row2));
                                console.log(armorName);
                                console.log(partsNeeded);
                                var armor2 = findOne(armorsForThisPage, "enName",armorName);
                                if(armor2){
                                    // console.log(armor2);
                                    if(!armor2.items) armor2.items = [];
                                    armor2.items.push({
                                        lvl: lvl,
                                        parts: partsNeeded
                                    });
                                }
                            }

                        }
                        
                    }
                });

                // console.log(armorsForThisPage);
                next(armorsForThisPage);
            }catch(e){
                console.log(url + " ERROR");
                console.log(e);
                next([]);
            }
        }
    });

}

function getArmorSkills($,row){
    var aSkills = [];
    var skills = $("td:nth-child(13)>small",row).html().split("</span>")
        .map((t) => t.replace("\<span style=\"color: green\">","")
        .replace("\<span style=\"color: red\">",""));
        
    skills.forEach(skill => {
        if(skill.trim()){
            var aSkill = {
                skill: skill.trim().split(':')[0],
                val: skill.trim().split(":")[1]
            };
            aSkills.push(aSkill);
        }
    });

    return aSkills;
}

function getParts($,td){
    var items = [];
    $("div>a>ruby>rt",td).each((i,el) => {
        var rt = $(el);
        var fname = rt.parent().parent().text();
        var fwq = rt.parent().parent().parent().text();
        var qty = fwq.replace(fname,"").trim();

        var item = {
            enName : utils.getNames($,rt).enName,
            jpName : utils.getNames($,rt).jpName,
            qty : qty
        }
        items.push(item);
    })
    return items;
}

// scrap armors
function run(){

    // Get Monsters
    var url = "http://wiki.mhxg.org/data/2501.html";
    var mons = [];
    var armors = [];
    // getTable(url,(a) => { 
    //     console.log(a.text());
    //     var monName = a.text();
    //     var monUrl  = "http://wiki.mhxg.org/" + a.attr('href');

    //     console.log(monUrl);
    //     getSpawn(monUrl,(qqq) => {
    //         // console.log(qqq);
    //         var mon = { name: monName,spawn: qqq };
    //         console.log(mon);
    //         addMonster(mon);
            
    //     });
    // });

    getArmorsetsTable("https://mhxxx.kiranico.com/bougu",(a) => {
        console.log(a.attr('href'));
        getArmors(a.attr('href'),(rArmors) => {{
            // console.log("got:");
            // console.log(armors);
            rArmors.forEach(armor => {
                addAndSave(armors,armor,"enName","armors.json");
            });
            // console.log(processed);
        }});
    });

    // getArmors("https://mhxxx.kiranico.com/bougu/544a7",(a) => {{
    //     a.forEach(armor => {
    //         addAndSave(armors,armor,"enName","armors.json");
    //     });
    //     console.log(processed);
    // }});
   
}

function findOne(list,prop,val){
    var matches = list.filter(el => el[prop].trim().toLowerCase() === val.trim().toLowerCase() );
    if(matches.length === 1) return matches[0];

    return null;
}

//run();
var queue = [{id:1,ct:1},{id:2,ct:3},{id:3,ct:1}];


function process(){
    if(queue.length == 0)
    {
        clearInterval(qId);
        return;
    }    
    var top = queue[queue.length - 1]; // top stack;
    console.log('processing ' + top.url);
    if(top.status === "done") { queue.pop(); return; }
    if(top.status === "new") {
        top.status = "ip";  
        getArmors(top.url,top.rank,(rArmors) => {{
            // console.log("got:");
            // console.log(armors);
            rArmors.forEach(armor => {
                addAndSave(armors,armor,"enName","armors.json");
            });
            top.status = "done";
            // console.log(processed);
        }});
    }
}

function processQueue(){
    getArmorsetsTable("https://mhxxx.kiranico.com/bougu",(a) => {
        console.log(a);
        // save to Json
        fs.writeFileSync("armorseturls.json",JSON.stringify(a));
        
        // getArmors(a.attr('href'),(rArmors) => {{
        //     // console.log("got:");
        //     // console.log(armors);
        //     rArmors.forEach(armor => {
        //         addAndSave(armors,armor,"enName","armors.json");
        //     });
        //     // console.log(processed);
        // }});
    });
}
var armors = [];
function processQueue2(){
    
    fs.readFile("armorseturls.json",(err,data) => {
        if (err) throw err;
        console.log(data);
        var a = JSON.parse(data);
        a.forEach(el => {
            el.status="new";
            queue.push(el);
        });

        var qId = setInterval(() => {
            
            process();
        },100);
        // getArmors(a.attr('href'),(rArmors) => {{
        //     // console.log("got:");
        //     // console.log(armors);
        //     rArmors.forEach(armor => {
        //         addAndSave(armors,armor,"enName","armors.json");
        //     });
        //     // console.log(processed);
        // }});
    });
}

 processQueue2();


// getArmors("https://mhxxx.kiranico.com/bougu/544a7",1,(a) => {{
//     a.forEach(armor => {
//         addAndSave(armors,armor,"enName","armors.json");
//     });
//     console.log(processed);
// }});