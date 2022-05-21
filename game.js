$(document).ready(function(){
    function isset(obj,nested) {
        var dub=obj
        var isset=false
        if(typeof(obj)!="undefined" && typeof(nested)!="undefined"){
            var arr=nested.split('=>');
            for(var k in arr){
                var key=arr[k];
                if(typeof(dub[key])=="undefined"){
                    isset=false;
                    break;
                }
                dub=dub[key];
          isset=dub
            }   
        }
        
        return isset;
    }
    var attackers=parseInt(Math.random()*100);
    var defenders=parseInt(Math.random()*100);
    var selected=null;
    var end=false;
    var xle = new Array(8);
    var tier = new Array(2);
    var tiers = [
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
        'X',
    ];
    var unit = new Array(2);
    var units = [
        'I',
        'II',
        'III',
    ];
    var terrain = new Array(1);
    var terrains = [
        'plain',
        'desert',
        'mountain',
        'hill',
        'swamp',
        'valley',
    ];
    
    var building = new Array(1);
    var buildings = [
        'village',
        'castle',
        'town',
    ];
    const tiersLenght = tiers.length;
    const unitsLenght = units.length;
    const terrainsLenght = terrains.length;
    const buildingsLenght = buildings.length;
    tier[0]=tiers[parseInt((Math.random())*(tiersLenght))];
    tier[1]=tiers[parseInt((Math.random())*(tiersLenght))];
    unit[0]=units[parseInt((Math.random())*(unitsLenght))];
    unit[1]=units[parseInt((Math.random())*(unitsLenght))];
    terrain[0]=terrains[parseInt((Math.random())*(terrainsLenght))];
    building[0]=buildings[parseInt((Math.random())*(buildingsLenght))];
    var score=0;
    var attack=null;
    var defend=null;
    var winner=null;
    var attacker = [
        tier[0],
        unit[0],
    ];
    var defender = [
        tier[1],
        unit[1],
    ];
    function data(arg1,arg2){
        switch(arg1){
            case 0:
                if(isset(() => arg2)){
                    return attacker[arg2]
                }
                break;
            case 1:
                if(isset(() => arg2)){
                    return attacker[arg2]
                }
                break;
            default:
                return null;
                break;
        }
    }
    $(".attackerCount").text(attackers+"("+unit[0]+")");
    $(".defenderCount").text("("+unit[1]+")"+defenders);
    $(".terrain").text(terrain[0]);
    $(".build").text(building[0]);
    $("#attackerUnit").text(unit[0]);
    $("#attackerTier").text(tier[0]);
    $("#defenderUnit").text(unit[1]);
    $("#defenderTier").text(tier[1]);
    setInterval(function(){
        if(end==false){
            var att = 1;
            switch(unit[0]){
                case "I":
                    att = 1.2;
                break;
                case "II":
                    att = 1.6;
                break;
                case "III":
                    att = 2.0;
                break;
            }
            var def = 1;
            switch(unit[1]){
                case "I":
                    def = 1.2;
                break;
                case "II":
                    def = 1.6;
                break;
                case "III":
                    def = 2.0;
                break;
            }
            xle[0] = Math.random();
            xle[1] = Math.random();
            xle[2] = ((xle[0]*5)*att)*(attackers/(Math.random()*100));
            xle[3] = ((xle[1]*5)*def)*(defenders/(Math.random()*100));
            xle[4] = $("#bar").width();
            xle[5] = xle[4]+10;
            xle[6] = xle[4]-10;
            xle[7] = $(".result").text();
            $(".log").append("<li class='attackersLog'> Attackers: "+xle[2]+"</li>");
            $(".log").append("<li class='defendersLog'> Defenders: "+xle[3]+"</li>");
        }
    },100);
    function Winner(){
        if(end==false){
            if(xle[7]=="Attackers Won!"){
                winner="Attackers";
            }else if(xle[7]=="Defenders Won!"){
                winner="Defenders";
            }
        }
    }
    function Result(){
        if(winner==null && end==false){
            if(score>0 && score<=96){
                if(xle[7]!="Attackers Won!" && xle[7]!="Attackers Losing!"){
                    $(".result").text("Attackers Losing!");
                    $("title").text("Attackers Losing!");
                }
            }else if(score<0 && score>=-96){
                if(xle[7]!="Defenders Won!" && xle[7]!="Defenders Losing!"){
                    $(".result").text("Defenders Losing!");
                    $("title").text("Defenders Losing!");
                }
            }else if(score==0){
                $(".result").text("Draw");
                $("title").text("Draw");
            }
        }
    }
    function Attack(){
        if(end==false && attack==null){
            var attackerUnit = 1;
            switch(unit[0]){
                case "I":
                    attackerUnit = 1.2;
                break;
                case "II":
                    attackerUnit = 1.6;
                break;
                case "III":
                    attackerUnit = 2.0;
                break;
            }
            var beforeAttack=xle[2];
            attack=(Math.random()*attackerUnit)*(attackers);
            xle[2]+=attack;
            console.log("Attack:"+attack+"\nBefore:"+beforeAttack+"\nAfter:"+xle[2]);
        }
    }
    function Defend(){
        if(end==false && defend==null){
            var defenderUnit = 1;
            switch(unit[1]){
                case "I":
                    defenderUnit = 1.2;
                break;
                case "II":
                    defenderUnit = 1.6;
                break;
                case "III":
                    defenderUnit = 2.0;
                break;
            }
            var beforeDefend=xle[3];
            defend=(Math.random()*defenderUnit)*(defenders);
            xle[3]+=defend;
            console.log("Defend:"+defend+"\nBefore:"+beforeDefend+"\nAfter:"+xle[3]);
        }
    }
    $(document).on('keyup',function(event) {if(event.keyCode == 65 || event.keyCode==37) {Attack();}});
    $(document).on('keyup',function(event) {if(event.keyCode == 68 || event.keyCode==39) {Defend();}});
    $(".attacker").on("click",function(){Attack();});
    $(".defender").on("click",function(){Defend();});
    setInterval(function(){
        if(attack!=null){
            xle[2]+=attack;
            $(".log").append("<li class='attackersLog' style='color:darkred;'> Attackers: "+xle[2]+"</li>");
            attack=null;
        }
        if(defend!=null){
            xle[3]+=defend;
            $(".log").append("<li class='defendersLog' style='color:darkblue;'> Defenders: "+xle[3]+"</li>");
            defend=null;
        }
        if(xle[2]>xle[3] && end==false){
            if(xle[4]<=490 && xle[4]>=10){
                $("#bar").css({"width":xle[5],});
                score-=4;
                $(".score").text(score);
                Result();
            }else if(xle[4]>=500 && end==false){
                if(xle[7]!="Attackers Won!"){
                    $(".result").text("Attackers Won!");
                    $("title").text("Attackers Won!");
                    $(".defenderCount").css({"text-decoration":"line-through red 5px"});
                    $(".build").css({"color":"rgb(255,0,0)"});
                    $(".result").css({"color":"red","text-shadow":"0 0 20px black"});
                }xle[4]=null;end=true;Winner();
            }
        }
        else if(xle[3]>xle[2] && end==false){
            if(xle[4]>=10 && xle[4]<=490){
                 $("#bar").css({"width":xle[6],});
                 score+=4;
                 $(".score").text(score);
                 Result();
            }else if(xle[4]<=0 && end==false){
                if(xle[7]!="Defenders Won!"){
                    $(".result").text("Defenders Won!");
                    $("title").text("Defenders Won!");
                    $(".attackerCount").css({"text-decoration":"line-through blue 5px"});
                    $(".result").css({"color":"blue","text-shadow":"0 0 20px black"});
                }xle[4]=null;end=true;Winner();
            }
        }
    },100);
});