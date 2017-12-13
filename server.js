var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


app.get('/scrape', function(req, res){
  scrap();
  // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')
})

function log(str) {
  // console.log(str);
}


scrap();
// rMap();


var mons = [];
var monidx = 1;
var rSpawns = JSON.parse(fs.readFileSync('spawn.json'));
var rMSpawns = JSON.parse(fs.readFileSync('monspawn.json'));


function scrap(){
  url = 'https://mhxxx.kiranico.com/quest';
  request(url, function(error, response, html){
      if(!error){
        // start
        var tstart = new Date();
        var $ = cheerio.load(html,{decodeEntities:false});

        var title, release, rating;
        var quests = [];
        var quest = { title : "", release : "", rating : ""};
        var id = 1;
        for (var i = 1; i < 11; i++) {
          var tabTag = "#s0-" + i;
          // get rows of tab
          $(tabTag + ">div.table-responsive>table>tbody>tr").each(function(j,elem){
            var row = $(this);

            var type =  $($('small>div',row)[0]).text();
            //check if new row
            if(type)
            {
              var map = $($('small>div',row)[1]).text();
              var mapEN = $("rt",$($('small>div',row)[1])).text();
              var mapJP = map.replace(mapEN,"");

              var aTitle = $('td:nth-child(2)>a',row);
              var title = aTitle.text();
              var titleJP = aTitle.html().split("<br>")[1].trim();
              var titleEN = aTitle.html().split("<br>")[0].trim();

              var quest = {
                category : "Village ",
                rank : i + "",
                type : $($('small>div',row)[0]).text(),
                map : map,
                mapJP: mapJP,
                mapEN: mapEN,
                title: title,
                titleJP: titleJP,
                titleEN: titleEN,
                target: getTargets($,row,mapJP),
                mainquest: $('td:nth-child(5)',row).text().trim(),
              }
              quest.code = "QSTVLGR" + quest.rank + "ID" + id;
              ++id;

              // tag
              if($('td>span',row))
              {
                quest.tag = $('td>span',row).text();
              }

              lastquest = quest;
              quests.push(quest);
            }else {
              //subq
              lastquest.subquest = $('td:nth-child(1)',row).text().trim();
            }
          })

        }

        for (var i = 1; i < 15; i++) {
          var tabTag = "#s1-" + i;
          // get rows of tab
          $(tabTag + ">div.table-responsive>table>tbody>tr").each(function(j,elem){
            var row = $(this);

            var type =  $($('small>div',row)[0]).text();
            //check if new row
            if(type)
            {
              var map = $($('small>div',row)[1]).text();
              var mapEN = $("rt",$($('small>div',row)[1])).text();
              var mapJP = map.replace(mapEN,"");
              var aTitle = $('td:nth-child(2)>a',row);
              var title = aTitle.text();
              var titleJP = aTitle.html().split("<br>")[1].trim();
              var titleEN = aTitle.html().split("<br>")[0].trim();


              var quest = {
                category : "Hub ",
                rank : ((i>7) ? "G " + (i-10) : i + "") ,
                type : $($('small>div',row)[0]).text(),
                map : map,
                mapJP: mapJP,
                mapEN: mapEN,
                title: title,
                titleJP: titleJP,
                titleEN: titleEN,
                target: getTargets($,row,mapJP),
                mainquest: $('td:nth-child(5)',row).text().trim(),
              }
              quest.code = "QSTHUBR" + quest.rank + "ID" + id;
              ++id;

              // tag
              if($('td>span',row))
              {
                quest.tag = $('td>span',row).text();
              }

              lastquest = quest;
              quests.push(quest);
            }else {
              //subq
              lastquest.subquest = $('td:nth-child(1)',row).text().trim();
            }
          })

        }

        for (var i = 1; i < 19; i++) {
          var tabTag = "#s4-" + i;
          // get rows of tab
          $(tabTag + ">div.table-responsive>table>tbody>tr").each(function(j,elem){
            var row = $(this);

            var type =  $($('small>div',row)[0]).text();

            //check if new row
            if(type)
            {
              var map = $($('small>div',row)[1]).text();
              var mapEN = $("rt",$($('small>div',row)[1])).text();
              var mapJP = map.replace(mapEN,"");

              var aTitle = $('td:nth-child(2)>a',row);
              var title = aTitle.text();
              var titleJP = aTitle.html().split("<br>")[1].trim();
              var titleEN = aTitle.html().split("<br>")[0].trim();

              var quest = {
                category : "Permit",
                // rank : ((i>7) ? "G★ " + (i-10) : i + " ★") ,
                rank : i + "",
                type : $($('small>div',row)[0]).text(),
                map : map,
                mapJP: mapJP,
                mapEN: mapEN,
                title: title,
                titleJP: titleJP,
                titleEN: titleEN,
                target: getTargets($,row,mapJP),
                mainquest: $('td:nth-child(5)',row).text().trim(),
              }
              quest.code = "QSTPRMR" + quest.rank + "ID" + id;
              ++id;
              // tag
              if($('td>span',row))
              {
                quest.tag = $('td>span',row).text();
              }

              lastquest = quest;
              quests.push(quest);
            }else {
              //subq
              lastquest.subquest = $('td:nth-child(1)',row).text().trim();
            }
          })

        }

        // $('.star-box-giga-star').filter(function(){
        //     var data = $(this);
        //     rating = data.text();
        //
        //     json.rating = rating;
        // })
      }
    fs.writeFile('quests.json', JSON.stringify(quests, null, 4), function(err){

        console.log('Quests Done');
        console.log('Took ' + (new Date() - tstart)/1000 + 's');
    })

    fs.writeFile('mons.json', JSON.stringify(mons, null, 4), function(err){

        // console.log('File successfully written! - Check your project directory for the output.json file');
        console.log('Mons Done');
        console.log('Took ' + (new Date() - tstart)/1000 + 's');
    })
}) ;

}

function getTargets($,row,map){
  var col = $('td:nth-child(3)',row);
  var targets = [];
  // get divs
  $('div',col).each(function(elem,i){
    var div = $(this);
    var mon = {
      Name: div.text().trim(),
      ENName: $('rt',div).text().trim(),
      JPName: div.text().replace($('rt',div).text(),"").trim()
    };
    // get spawn area
    var tMon = mon;

    // add to mons
    var matches = mons.filter(spwn => spwn.ENName === mon.ENName);
    if(matches.length == 0) {
      mon.code = "MON" + "LRGID" + monidx;
      mons.push(mon);
      ++monidx;
    }
    
    
    var sMatches = rMSpawns.filter(spwn => spwn.name === mon.JPName);
    
    if(sMatches.length >0)
    {
      // console.log(sMatches[0]);
      // console.log(map);
      // console.log(sMatches[0].spawn);
    

      var trg = sMatches[0];
      // tMon.spawn = sMatches[0][map.trim()];
      tMon.spawn = "";

      //get correct spawn
      var spawnMatch = trg.spawn.filter(sm => sm.map === map);
      if(spawnMatch.length > 0)
      {
        tMon.spawn = spawnMatch[0].spawn;
        // console.log(tMon);
      }
    }

    targets.push(tMon);
  });

  return targets;
}


// start scraping!!

function rMap(){
  // connect quests and targets
  var rQuests = JSON.parse(fs.readFileSync('quests.json'));
  var rSpawns = JSON.parse(fs.readFileSync('monspawn.json'));
  var rMapped = [];

  rQuests.forEach(qst => {
    if(qst.target && qst.target.length > 0){
      // find each target
      qst.target.forEach(tgt => {
        var matches = rSpawns.filter(spwn => tgt.JPName === spwn.name);
        if(matches.length > 0){
          rMapped.push({
            quest: qst.title,
            qcode: qst.code,
            target: tgt.ENName,
            spawn: matches[0].spawn,
            area: "test"
          });
        }
      });

      // find in spawn.json
      // var matches = rSpawns.filter(spwn => qst.target.includes(spwn.Name));
      // console.log(qst.target);
      // console.log(matches);
      // if(matches.length > 0){
      //   rMapped.push({
      //     quest: qst.title,
      //     target: qst.target,
      //     spawn: matches[0].Name,
      //     area: "test"
      //   });
      // }
    }
  });

  fs.writeFile('mapped.json',JSON.stringify(rMapped),err => {
    console.log("Done");
  });
}




