"use strict";
const sec2hms = function(diff){
    const zerofill=v=>{return v<10?"0"+v:v;};
    let diffs = zerofill(Math.floor(diff%60));
    let diffh = Math.floor(diff/3600);
    let diffm = zerofill(Math.floor(diff/60-diffh*60));
    return diffh+"h"+diffm+"m"+diffs+"s";
};
const addList = function(start,end){
    let sd = new Date(start);
    let ed = new Date(end) ;

    
    let diff = (ed.getTime() - sd.getTime())/1000;
    let nowtime = new Date();
    
    if(end==null){
        diff = nowtime.getTime()-sd.getTime()/1000;
        end = "";
    }
    $("#timetablebody").append("<tr><td>"+start+"</td><td>"+end+"</td><td>"+sec2hms(diff)+"</td></tr>");
};
const checkInOut = function(d){
    if(d.length==0){
        $("#c").text("らぼいん");return 0;
    }
    if( d[0][1]==null){
        $("#c").text("らぼりだ");
    }else{
        $("#c").text("らぼいん");
    }
};
const reload = function(d){
          d = d || [];
          console.log(d);
          $("#timetablebody").empty();
          for(let i=0;i<d.length;++i){
                addList(d[i][0],d[i][1]);
          }
          checkInOut(d);
}
const clock = function(){
    const rida = $("#timetablebody tr:first-child td:nth-child(2)").text();
   
    if(rida==""){
        const inn = Date.parse($("#timetablebody tr:first-child td:nth-child(1)").text());
        const nowtime = new Date();
        const diff = (nowtime.getTime()-inn)/1000;
        $("#timetablebody tr:first-child td:nth-child(3)").text(sec2hms(diff));
    }
};
$(function(){
  //データ取得
  let d;
  $.getJSON(
      "data",
      null,
      function(data,status){
          d = data;
          reload(data);
          setInterval(clock,200);
      }
  );

});
$("#c").on("click",function(){
    $.getJSON(
        "push",
        null,
        function(data,status){
            reload(data);
        }
    )
});
