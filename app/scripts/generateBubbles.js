var allData = [];

function getData(){
    d3.csv("../../resources/my-data-transposed-new.csv", function( data ){
        handleCsvData( data );
    });
}

function handleCsvData( data ){
    data.forEach(function( row ){
        var concatData =  {
            posData : {
                posX : 20 + (width - 40) * Math.random(), posY : 20 + (height - 40) * Math.random()
            },
            pageData : row
        };
        allData.push( concatData );
    });

    main();
}

function main(){
    createActivityScale();
    createLikeBubbles();
    moveBubbles();
}

var activityScale;
var botValue = 1;
var topValue = 1;
function createActivityScale( ) {
    for (var k = 0; k < allData.length; k++) {
        var daily_engaged = parseInt(allData[k].pageData.lifetime_likes);
        if (daily_engaged > topValue) {
            topValue = daily_engaged;
        } else {
            if (daily_engaged < botValue) {
                botValue = daily_engaged;
            }
        }
    }
    activityScale = d3.scale.linear()
        .domain( [botValue, topValue] )
        .range( [0, 1] );
}

function createLikeBubbles(){
    bubbleGroup.selectAll(".bubble")
        .data(allData)
        .enter()
        .insert("circle")
        .attr("class", "bubble")
        .attr("fill", "rgba(200,200,200,0.1)")
        .attr("stroke", "#ececec")
        .attr("data-likes", function(d){ return parseInt(d.pageData.daily_new_likes)})
        .attr("date", function(d){ return d.pageData.Date} )
        .attr("engaged", function(d){ return d.pageData.daily_engaged} )
        //.attr("cx", function(d){ return d.posData.posX})
        //.attr("cy", function(d){ return d.posData.posY})
        .attr("r", function(d){ return parseInt(d.pageData.daily_new_likes) });

    d3.selectAll(".bubble")
        .on("mouseenter", function(d){
            document.getElementById("bubbleStat").innerHTML =
                '<i class="fa fa-thumbs-up"></i><h3 id="dailyLikes">' + d.pageData.daily_new_likes + '</h3>';
            document.getElementById("bubbleDate").innerHTML =
                '<i class="fa fa-calendar"></i><h4 id="selectedDate">' + d.pageData.Date + '</h4>';
        })
        .on("click", function(d){ // for mobile taps
            document.getElementById("bubbleStat").innerHTML =
                '<i class="fa fa-thumbs-up"></i><h3 id="dailyLikes">' + d.pageData.daily_new_likes + '</h3>';
            document.getElementById("bubbleDate").innerHTML =
                '<i class="fa fa-calendar"></i><h4 id="selectedDate">' + d.pageData.Date + '</h4>';
        })
}

function randomBetween(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

var bubbleTl = new TimelineMax({
    repeat: -1
});
function moveBubbles(){
    var allBubbles = $(".bubble");



    for(var i = 0; i < allBubbles.length; i++){


        var b = TweenMax.fromTo(allBubbles[i], randomBetween(20, 40), {
            data: allData[i].pageData,
            x:width/2,
            y:height*0.7,
            height: 200,
            rotation:randomBetween(-720, 720),
            opacity: 1,
            onUpdate: onUpdateFunction,
            onUpdateParams: ["{self}"]



        },{
            onStart: onStartFunction,
            onComplete: hideObject,
            x:randomBetween(0, width),
            y:randomBetween(0, height*Math.pow(0.7, 2)),
            rotation:0,
            opacity: 0,
            transformOrigin: randomBetween(-50, 50) + "px 50px",
            ease:Linear.easeInOut

        });

        bubbleTl.add(b, i/5);
    }

    bubbleTl.repeat = -1;
}

function onStartFunction(){
    $("[date='" + this.target.__data__.pageData.Date + "']").addClass("active");
    filterBubbles(currentFilterValue);
    $("#activityFadeBox").css("opacity", activityScale(parseInt(this.target.__data__.pageData.lifetime_likes)));
    document.getElementById("currentLikes").innerHTML = this.target.__data__.pageData.lifetime_likes;
    document.getElementById("currentDate").innerHTML = this.target.__data__.pageData.Date;

}

function onUpdateFunction( obj ){

}

function hideObject( obj ){
    if(obj){
        obj.hide(300);
    } else {
        $("[date='" + this.target.__data__.pageData.Date + "']").removeClass("active");
    }
}

var height = window.innerHeight;
var width = window.innerWidth;

var oceanSvg = d3.select("#oceanContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var bubbleGroup = oceanSvg.append("g")
    .attr("class", "bubbles");

getData();