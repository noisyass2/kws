
function loadAll(dta) {
        
    var tbl = "<table class='tbl' cellspacing='0'><tbody>";
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
    if(rank != ""){
        keyData = keyData.filter((q) => q.rank == rank + "");
    }
    if(search != ""){
        keyData = keyData.filter((q) => JSON.stringify(q).toLowerCase().includes(search.toLowerCase()));
    }
    loadAll(keyData);
}

function getData(row) {
    var tr = "<tr>";
    tr = getMainData(tr, row);
    tr += "<td> <button onclick='add(this)' data-armor='" + JSON.stringify(row) + "'>Add</button> </td>";
    tr+="</tr>";
   
    return tr;
}
function getData2(row) {
    var tr = "<tr>";
    tr += "<td>Rare " + row.rank + "</td>";
    tr += "<td>" + row.jpName + "<br>" + row.enName + "</td>";
    tr += "<td> <button onclick='rem(this)' data-armor='" + JSON.stringify(row) + "'>Del</button> </td>";
    tr+="</tr>";
   
    return tr;
}
function getMainData(tr, row) {
    tr += "<td>Rare " + row.rank + "</td>";
    tr += "<td>" + row.jpName + "<br>" + row.enName + "</td>";
    tr += "<td>" + getSkills(row) + "</td>";
    tr += "<td>" + getItems(row) + "</td>";
    return tr;
}

function getSkills(arm){
    var tds = [];
    
    arm.skills.forEach(s => {
        var td = "<div>";
        td += '<span>' + s.skill + " : " + s.val + '</span>';
        td+= "</div>";
        tds.push(td);
    });

    return tds.join('');
}

function getItems(arm){
    if(arm.items){
        var reqs = arm.items[0];
        var divs = reqs.parts.map(s => "<div>" + s.enName + " " + s.qty + "</div>");

        return divs.join('');
    }
    return '';
}

var selArmors = [];
function add(el){
    console.log("add called");
    var td = $(el);
    console.log(td);
    var tdData = JSON.parse(td.attr('data-armor'));
    console.log(tdData);

    // Add to selected armors
    selArmors.push(tdData);
    loadSelArmors(selArmors);
}

function rem(el){
    console.log("rem called");
    var td = $(el);
    console.log(td);
    var tdData = JSON.parse(td.attr('data-armor'));
    console.log(tdData);

    // Add to selected armors
    selArmors = selArmors.filter(arm => arm.enName != tdData.enName);
    loadSelArmors(selArmors);
}

function loadSelArmors(dta){
    var tbl = "<table  class='tbl' cellspacing='0'><tbody>";
    dta.forEach(q => {
        tbl+= getData2(q);
    });
    tbl+= "</tbody></table>";
    $("#tbl2").html(tbl); 

    // get skills
    var skls = [];
    dta.forEach(q => {
        console.log(q);
        q.skills.forEach(skill => {
            var skl = skls.filter(s => s.skill == skill.skill);

            if(skl.length > 0){
                console.log(skl[0])
                skl[0].val += parseInt(skill.val);   
            }else{

                var skl =  {
                    skill : skill.skill,
                    val : parseInt(skill.val)
                }
                // console.log(skl);
                skls.push(skl);
            }
        });
        
    })

    // get skills
    var parts = [];
    dta.forEach(q => {
        console.log(q);
        q.items[0].parts.forEach(part => {
            var skl = parts.filter(s => s.name == part.enName);

            if(skl.length > 0){
                console.log(skl[0])
                skl[0].qty += parseInt(part.qty.replace ( /[^\d.]/g, '' ));   
            }else{

                var skl =  {
                    name : part.enName,
                    jname : part.jpName,
                    qty : parseInt(part.qty.replace ( /[^\d.]/g, '' ))
                }
                // console.log(skl);
                parts.push(skl);
            }
        });
        
    })

    console.log(skls);
    var idivs = skls.map(s => { return s.skill + " " + s.val }).join('<br>');
    $("#skills").html(idivs);

    var idivs2 = parts.map(s => { return s.name + " " + s.qty }).join('<br>');
    $("#parts").html(idivs2);
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

$("#rank").change(function(e){
    e.preventDefault();
    rank = $("#rank").val();
    loadfiltered();
})