var allData = [];

function getData(){
    d3.csv("resources/my-data-transposed-new.csv", function( data ){
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


//******************** Sunburst ********************//

var sunburstContainer = document.getElementById("likeBurstContainer");
var dThreeSunburstContainer = d3.select(sunburstContainer);
var sunburstWidth = sunburstContainer.offsetWidth,
    sunburstHeight = sunburstContainer.offsetHeight,
    radius = (Math.min(sunburstWidth, sunburstHeight) / 2) - 30;


makeLifetimeSunburst(sunburstWidth, sunburstHeight, radius);

function makeLifetimeSunburst(width, height, radius){


    //console.log(mockData.children);
    //console.log(mockData);

    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.sqrt()
        .range([0, radius]);

    var color = d3.scale.category20c();

    var sunburstSvg = dThreeSunburstContainer.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    var partition = d3.layout.partition()
        .sort(null)
        .value(function(d) { return 1; });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
        .innerRadius(function(d) { return Math.max(0, y(d.y)); })
        .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

// Keep track of the node that is currently being displayed as the root.
    var node;
    var sunburstTooltip = $("#sunburstTooltip");
    var tickerContainer = $(".tickerContainer");

    d3.json("resources/like_demography.json", function(error, root) {

        node = root;
        var path = sunburstSvg.datum(root).selectAll("path")
            .data(partition.nodes)
            .enter().append("path")
            .attr("d", arc)
            .attr("partitionName", function(d){ return (d.children ? d : d.parent).name })
            .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
            .on("click", click)
            .on("mouseenter", function(d){ mouseEnter(d) })
            .on("mousemove", function (d){ showTooltip(d) })
            .on("mouseleave", function(d){ $("#sunburstTooltip").removeClass("active"); mouseLeave(d) })
            .each(stash);


        d3.selectAll(".sunburstRadio input").on("change", function change() {
            var value = this.value === "count"
                ? function() { return 1; }
                : function(d) { return d.size; };

            path
                .data(partition.value(value).nodes)
                .transition()
                .duration(400)
                .attrTween("d", arcTweenData);
        });

        // Given a node in a partition layout, return an array of all of its ancestor
        // nodes, highest first, but excluding the root.
        function getAncestors(node) {
            var path = [];
            var current = node;
            while (current.parent) {
                path.unshift(current);
                current = current.parent;
            }
            return path;
        }

        // Restore everything to full opacity when moving off the visualization.
        function mouseLeave(d) {
            // Deactivate all segments during transition.
            d3.selectAll("path").on("mouseover", null);

            // Transition each segment to full opacity and then reactivate it.
            d3.selectAll("path")
                .style("opacity", 1);
        }

        function mouseEnter(d){
            var sequenceArray = getAncestors(d);

            $("#sunburstTooltip").addClass("active")
            // Fade all the segments.
            d3.selectAll("path")
                .style("opacity", 0.3);

            // Then highlight only those that are an ancestor of the current segment.
            sunburstSvg.selectAll("path")
                .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                })
                .style("opacity", 1);
        }

        function click(d) {
            node = d;
            path.transition()
                .duration(400)
                .attrTween("d", arcTweenZoom(d));
        }
    });

    function showTooltip(d){
        var relX = event.pageX - ( event.pageX > ( tickerContainer.width() - 120) ? 80 : - 20 );
        var relY = event.pageY - ( event.pageY > ( tickerContainer.height() - 80) ? 80 : - 20);

        sunburstTooltip.html( (d.size ? "Ages " : "") + d.name + (d.size ? " : <strong>" + d.size + "</strong>" : ""));
        sunburstTooltip.css({"transform" : "translate( " + relX + "px, " + relY + "px )"});
    }

    d3.select(self.frameElement).style("height", height + "px");

// Setup for switching data: stash the old values for transition.
    function stash(d) {
        d.x0 = d.x;
        d.dx0 = d.dx;
    }

// When switching data: interpolate the arcs in data space.
    function arcTweenData(a, i) {
        var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
        function tween(t) {
            var b = oi(t);
            a.x0 = b.x;
            a.dx0 = b.dx;
            return arc(b);
        }
        if (i == 0) {
            // If we are on the first arc, adjust the x domain to match the root node
            // at the current zoom level. (We only need to do this once.)
            var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
            return function(t) {
                x.domain(xd(t));
                return tween(t);
            };
        } else {
            return tween;
        }
    }

// When zooming: interpolate the scales.
    function arcTweenZoom(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(d, i) {
            return i
                ? function(t) { return arc(d); }
                : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
        };
    }
}



getData();