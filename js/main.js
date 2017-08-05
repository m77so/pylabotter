"use strict";
const addList = function(start,end){
    let sd = new Date(start);
    let ed = new Date(end) ;

    const zerofill=v=>{return v<10?"0"+v:v;};
    let diff = (ed.getTime() - sd.getTime())/1000;
    let nowtime = new Date();
    diff = diff<0?(nowtime.getTime()-sd.getTime())/1000:diff;
    let diffs = zerofill(Math.floor(diff%60));
    let diffh = Math.floor(diff/3600);
    let diffm = zerofill(Math.floor(diff/60-diffh*60));
    $("#timetablebody").append("<tr><td>"+start+"</td><td>"+end+"</td><td>"+diffh+"h"+diffm+"m"+diffs+"s</td></tr>");
};
const checkInOut = function(d){
    if(d.length==0){
        $("#c").text("らぼいん");return 0;
    }
    if( d[d.length-1][1]==undefined){
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
$(function(){
  //データ取得
  let d;
  $.getJSON(
      "data",
      null,
      function(data,status){
          reload(data);
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
