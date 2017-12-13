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

function scrap(){
  url = 'https://mhxxx.kiranico.com/quest';
  request(url, function(error, response, html){
      if(!error){
        // start
        var tstart = new Date();
        var $ = cheerio.load(html);

        var title, release, rating;
        var quests = [];
        var quest = { title : "", release : "", rating : ""};

        for (var i = 1; i < 11; i++) {
          var tabTag = "#s0-" + i;
          // get rows of tab
          $(tabTag + ">div.table-responsive>table>tbody>tr").each(function(j,elem){
            var row = $(this);

            log($($('small>div',row)[0]).text()); // type
            log($($('small>div',row)[1]).text()); // map
            log($('td:nth-child(2)',row).text()); // quest title
            var type =  $($('small>div',row)[0]).text();
            //check if new row
            if(type)
            {
              var quest = {
                category : "Village ",
                rank : i + "",
                type : $($('small>div',row)[0]).text(),
                map : $($('small>div',row)[1]).text(),
                title: $('td:nth-child(2)',row).text().trim(),
                target: $('td:nth-child(3)',row).text().trim(),
                mainquest: $('td:nth-child(5)',row).text().trim(),
              }

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

            log($($('small>div',row)[0]).text()); // type
            log($($('small>div',row)[1]).text()); // map
            log($('td:nth-child(2)',row).text()); // quest title
            var type =  $($('small>div',row)[0]).text();
            //check if new row
            if(type)
            {
              var quest = {
                category : "Hub ",
                rank : ((i>7) ? "G " + (i-10) : i + "") ,
                type : $($('small>div',row)[0]).text(),
                map : $($('small>div',row)[1]).text(),
                title: $('td:nth-child(2)',row).text().trim(),
                target: $('td:nth-child(3)',row).text().trim(),
                mainquest: $('td:nth-child(5)',row).text().trim(),
              }

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

            log($($('small>div',row)[0]).text()); // type
            log($($('small>div',row)[1]).text()); // map
            log($('td:nth-child(2)',row).text()); // quest title
            var type =  $($('small>div',row)[0]).text();
            //check if new row
            if(type)
            {
              var quest = {
                category : "Permit",
                // rank : ((i>7) ? "G★ " + (i-10) : i + " ★") ,
                rank : i + "",
                type : $($('small>div',row)[0]).text(),
                map : $($('small>div',row)[1]).text(),
                title: $('td:nth-child(2)',row).text().trim(),
                target: $('td:nth-child(3)',row).text().trim(),
                mainquest: $('td:nth-child(5)',row).text().trim(),
              }

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

        console.log('File successfully written! - Check your project directory for the output.json file');
        console.log('Took ' + (new Date() - tstart)/1000 + 's');
    })


}) ;
}

//app.listen(8010);
