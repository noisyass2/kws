
function loadAll(dta) {
        
    var tbl = "<table cellspacing='0'><tbody>";
    dta.forEach(q => {
        tbl+= getData(q);
    });
    tbl+= "</tbody></table>";
    $("#tbl").html(tbl); 

}

function loadfiltered(){
    var keyData = data;
    if(key != "") {
        keyData = keyData.filter((q) => q.tag===key|| q.tag === "Urgent");
    }
    if(cat != ""){
        keyData = keyData.filter((q) => q.category.trim() == cat);
    }
    if(search != ""){
        keyData = keyData.filter((q) => JSON.stringify(q).toLowerCase().includes(search.toLowerCase()));
    }
    loadAll(keyData);
}

function getData(quest) {
    var tr = "<tr>";
    tr += "<td>" + quest.category.trim().substring(0,1) + " " + quest.rank + "</td>";
    tr += "<td>" + quest.tag + "</td>";
    tr += "<td>" + quest.titleJP + "<br>" + quest.titleEN + "</td>";
    
    tr += "<td>" + quest.mainquest + 
    ((quest.subquest == "(None)") ? "" : "<hr>" + quest.subquest ) 
    + "</td>";
    tr += "<td>" + quest.mapJP + "<br>" + quest.mapEN + "</td>";
    tr += "<td>" + getTarget(quest.target) + "</td>";
    tr+="</tr>";
   
    return tr;
}


function getTarget(targets) {
    if(targets.length > 0){
        // var tgtbl = "<table><tbody>";
        
        // targets.forEach(tgt => {
        //     var tr = "<tr>";
        //     tr += "<td>" + tgt.JPName + "<br>" + tgt.ENName + "</td>";
        //     tr += "<td>" + tgt.spawn + "</td>";
        //     tr += "</tr>";
        //     tgtbl += tr;
        // });

        // tgtbl += "</tbody></table>";
        var tgtbl = "<div>";
        var stgts = [];
        targets.forEach(tgt => {
            
            var stgtbl = tgt.JPName + "<br>";
            stgtbl += tgt.ENName + "<br>";
            stgtbl += tgt.spawn + "<br>";
            
            stgts.push(stgtbl);
        })
        tgtbl += stgts.join("<hr>");
        tgtbl += "</div>";
        return tgtbl;
    }

    return "";
}


//  
var key = "";
var rank = "";
var cat = "";
var search = "";

loadAll(data);

$("#btnKey").click(function (e) {
    e.preventDefault();
    key="Key";
    loadfiltered();
});

$("#btnAll").click(function(e){
    e.preventDefault();
    key = "";
    rank = "";
    cat = "";
    search="";
    loadfiltered();
})



$("#btnCatV").click(function (e) {
    e.preventDefault();
    cat="Village";
    loadfiltered();
});
$("#btnCatH").click(function (e) {
    e.preventDefault();
    cat="Hub";
    loadfiltered();
});
$("#btnCatP").click(function (e) {
    e.preventDefault();
    cat="Permit";
    loadfiltered();
});

$("#btnSearch").click(function (e) {
    e.preventDefault();
    search=$("#txtSearch").val();
    loadfiltered();
})