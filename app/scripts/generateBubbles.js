var allData = [];

function getData(){
    d3.csv("../../resources/my-data-transposed.csv", function( data ){
        handleCsvData( data );
    });
}

function handleCsvData( data ){
    data.forEach(function( row ){
        var concatData =  {
            posData : {
                posX : width*Math.random(), posY : height*Math.random()
            },
            pageData : row
        };
        allData.push( concatData );
    });

    makeVisualization();
}

function makeVisualization(){
    createLikeBubbles();

}

function createColorScale( ) {
    for (var k = 1; k < question.length; k++) {
        if (parseFloat(question[k].poverty.replace(",", ".")) > topValue) {
            topValue = parseFloat(question[k].poverty.replace(",", "."));
        } else {
            if (parseFloat(question[k].poverty.replace(",", ".")) < botValue) {
                botValue = parseFloat(question[k].poverty.replace(",", "."));
            }
        }
    }
    color = d3.scale.linear()
        .domain( [botValue, topValue] )
        .range( ["#B56A49", "#5dac57"] );
}

function createLikeBubbles(){
    console.log( allData );

    bubbleGroup.selectAll(".bubble")
        .data(allData)
        .enter()
        .insert("circle")
        .attr("class", "bubble")
        .attr("date", function(d){ return d.pageData.Date} )
        .attr("engaged", function(d){ return d.pageData.daily_engaged} )
        .attr("cx", function(d){ return d.posData.posX})
        .attr("cy", function(d){ return d.posData.posY})
        .attr("r", 0)
        .transition()
        .attr("r", function(d){ return d.pageData.daily_engaged })
        .style("fill", "#ececec");
}

var height = window.innerHeight;
var width = window.innerWidth;

var oceanSvg = d3.select("#oceanContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var bubbleGroup = oceanSvg.append("g")
    .attr("class", "bubbles");

//oceanCanvas.append("svg")
//    .attr("width", width)
//    .attr("height", height)
//    .append("g")
//    .attr("class", "bubbles");

getData();






//<circle id="bubble" fill="none" stroke="#00588D" cx="0" cy="2" r="2" ></circle>

//
//var width  = window.innerWidth;
//var height = window.innerHeight;
//var scapeWidth = 400;
//
////var data = [45,23,12,56,21,86,65,78,3,54,34,98,23,12,34,76,38,12,56,21,56,83,27,64];
//var data = [348,408,406,414,420,394,442,472,466,436,426,462,454,436,408,306,230,182,146,114,118,174,258,350];
//
////var mountainData = [167, 213, 145, 180, 200,140,150,160,170];
////var mountainData = [160, 213, 170,145];
//var mountainData = [{"mainVal":160, "secondVal": 50},{"mainVal":213, "secondVal": 70},{"mainVal":170, "secondVal": 50},{"mainVal":145, "secondVal": 30}];
//
//var mountainPointData = [];
//
//var canvas = d3.select("body").append("svg")
//    .attr("width", width)
//    .attr("height", height);
//
//var scale = d3.scale.linear()
//    .domain(d3.extent(data))
//    .range([0,3]);
//
//var mScale = d3.scale.linear()
//    .domain(d3.extent(mountainData, function(d) {
//        return d["mainVal"];
//    }))
//    .range([100,300]);
//
//var triangle = d3.svg.symbol().type("triangle-up");
//var triangleD = d3.svg.symbol().type("triangle-down");
//
//function drawMountains() {
//    for (var x in mountainData){
//        numb = mScale(mountainData[x]["mainVal"]);
//        snowNumb = mountainData[x]["secondVal"];
//
//        yHeight = Math.floor(height/1.5);
//        overlap = 2;
//        numbMountainParts = mountainData.length*(overlap-1)+1;
//        mountainPartLength = scapeWidth/numbMountainParts;
//        mWidth = mountainPartLength*overlap;
//        mHeight = yHeight-numb;
//        mSep = x*(overlap-1)*mountainPartLength;
//        startX = scapeWidth/2/7;
//
//        x1 = width/2-233+mWidth/2+mSep+startX;
//        y1 = mHeight;
//        x2 = width/2-233+mWidth+mSep+startX;
//        y2 = yHeight;
//        x3 = width/2-233+mSep+startX;
//        y3 = yHeight;
//
//        y1d = yHeight + numb;
//
//        var points = x1 + "," + y1 + " ," + x2 + "," + y2 + " ," + x3 + "," + y3;
//        var pointsD = x1 + "," + y1d + " ," + x2 + "," + y2 + " ," + x3 + "," + y3;
//
//        maskId = "mask" + x;
//
//        maskIdD = "mask" + x + "d";
//
//        mountainPointData.push({"x":x1,"y":y1});
//
//        var mountainObject = canvas.append("g");
//
//        mountainObject.append("polygon")
//            .attr("points", points)
//            .attr("class", "mountain")
//            .append("rect")
//            .attr("width", mWidth)
//            .attr("height", snowNumb)
//            .attr("x", x3)
//            .attr("y", mHeight)
//            .attr("class", "snow")
//            .attr("mask", function(){
//                return "url(#" + maskId + ")";
//            });
//
//        // Mirror Mountain
//        mountainObject.append("polygon")
//            .attr("points", pointsD)
//            .attr("class", "mountainDown")
//            .append("rect")
//            .attr("width", mWidth)
//            .attr("height", snowNumb)
//            .attr("x", x3)
//            .attr("y", yHeight + numb)
//            .attr("class", "snow")
//            .attr("mask", function(){
//                return "url(#" + maskId + ")";
//            });
//
//        mountainObject.append("svg:mask")
//            .attr("id", maskId)
//            .append("polygon")
//            .attr("points", points)
//            .attr("fill", "#ffffff");
//
//        // Mirror Mask
//        mountainObject.append("svg:mask")
//            .attr("id", maskIdD)
//            .append("polygon")
//            .attr("points", pointsD)
//            .attr("fill", "#ffffff");
//
//        mountainObject.append("rect")
//            .attr("width", mWidth)
//            .attr("height", snowNumb)
//            .attr("x", x3)
//            .attr("y", mHeight)
//            .attr("class", "snow")
//            .attr("mask", function(){
//                return "url(#" + maskId + ")";
//            });
//
//        // Mirror Snow
//        mountainObject.append("rect")
//            .attr("width", mWidth)
//            .attr("height", snowNumb)
//            .attr("x", x3)
//            .attr("y", yHeight + numb - snowNumb)
//            .attr("class", "snowDown")
//            .attr("mask", function(){
//                return "url(#" + maskIdD + ")";
//            });
//
//        mountainObject.attr("mask", "url(#gradient");
//    }
//
//    var gradientFill = canvas.append("defs")
//        .append("linearGradient")
//        .attr("id", "gradientFill")
//        .attr("x1", "100%")
//        .attr("y1", "100%")
//        .attr("x2", "100%")
//        .attr("y2", "0%")
//        .attr("spreadMethod", "pad");
//
//    gradientFill.append("stop")
//        .attr("offset", "25%")
//        .attr("stop-color", "#000")
//        .attr("stop-opacity", 1);
//
//    gradientFill.append("stop")
//        .attr("offset", "50%")
//        .attr("stop-color", "#fff")
//        .attr("stop-opacity", 1);
//
//    gradientFill.append("stop")
//        .attr("offset", "100%")
//        .attr("stop-color", "#fff")
//        .attr("stop-opacity", 1);
//
//    canvas.append("svg:mask")
//        .attr("id", "gradient")
//        .append("rect")
//        .attr("width", scapeWidth)
//        .attr("height", mScale(d3.max(mountainData, function(d) { return +d.mainVal;}))*2 )
//        .attr("x", width/2-233+startX)
//        .attr("y", height/1.5-mScale(d3.max(mountainData, function(d) { return +d.mainVal;})))
//        .attr("fill", "url(#gradientFill)");
//
//    // add bird trail
//    mountainPointData.push({"x":x1+60,"y":y1-20});
//}
//
//drawMountains();
//
//function drawTimeForest() {}
//
//for(var x in data){
//    var numb = scale(data[x]);
//    if(numb%1>0.75) {
//        newNumb = Math.ceil(numb);
//    } else {
//        newNumb = Math.floor(numb);
//    }
//
//    var forestGroup = canvas.append("g").attr("class", "forest");
//
//    for(var y=0;y<newNumb;y++){
//        forestGroup.append("path")
//            .attr("d", triangle.size(100))
//            .attr("class", "forestObject")
//            .attr("id", function() {
//                return "TIME" + x;
//            })
//            .attr("transform", function() {
//                var newNumbSep = Math.floor(1/newNumb*15);
//                var xWidth = width/2-233+x*20+y*newNumbSep;
//                var yHeight = height/1.5-7;
//                return "translate(" + xWidth + "," + yHeight + ")";
//            });
//
//        // Mirror forest
//        forestGroup.append("path")
//            .attr("d", triangleD.size(100))
//            .attr("class", "forestObjectDown")
//            .attr("id", function() {
//                return "TIME" + x;
//            })
//            .attr("transform", function() {
//                var newNumbSep = Math.floor(1/newNumb*15);
//                var xWidth = width/2-233+x*20+y*newNumbSep;
//                var yHeight = height/1.5-7+13;
//                return "translate(" + xWidth + "," + yHeight + ")";
//            });
//    }
//}
//
//drawTimeForest();
//
//var lineFunction = d3.svg.line()
//    .x(function (d) {
//        return d.x;
//    })
//    .y(function (d) {
//        return d.y-20;
//    })
//    .interpolate("cardinal");
//
//
//function drawPlot() {
//
//    canvas.append("path")
//        .attr("d", lineFunction(mountainPointData))
//        .style("stroke-dasharray", ("3, 3"))
//        .style("stroke-width", 1)
//        .style("stroke", "rgb(6,120,155)")
//        .style("fill", "none")
//        .attr("opacity", .5);
//}
//
//var lastCoords = mountainPointData[mountainPointData.length-1];
//
//canvas.append("svg:image")
//    .attr("xlink:href", "bird.svg")
//    .attr("width", 12)
//    .attr("height", 12)
//    .attr("x", lastCoords.x+5)
//    .attr("y", lastCoords.y-32)
//    .attr("class", "bird");
//
//drawPlot();
//
//var line = canvas.append("line")
//    .attr("x1", function(d,i) {
//        return width/2-240;
//    })
//    .attr("x2", function(d,i) {
//        return width/2+240;
//    })
//    .attr("y1", function(d,i) {
//        return height/1.5;
//    })
//    .attr("y2", function(d,i) {
//        return height/1.5;
//    })
//    .attr("stroke", "#000")
//    .attr("opacity", 0);
//
//var timeObjects = canvas.selectAll("t")
//    .data(data)
//    .enter()
//    .append("g");
//
//var cubes = timeObjects.append("rect")
//    .attr("width", "19")
//    .attr("height", "19")
//    .attr("x", function(d,i) {return width/2-240+20*i;})
//    .attr("y", height/1.5)
//    .attr("fill", "red")
//    .attr("opacity","0");