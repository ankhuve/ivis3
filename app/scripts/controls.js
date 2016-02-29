var playing = true;
var togglePlay = document.getElementById("togglePlay");
function togglePlayAnimation(){
    if(playing){
        bubbleTl.pause();
        togglePlay.innerHTML = '<i class="fa fa-play"></i>';
    } else{
        bubbleTl.play();
        togglePlay.innerHTML = '<i class="fa fa-pause"></i>';
    }
    playing = !playing;
}


function restartAnimation(){
    $(".bubble").removeClass( 'active' );
    bubbleTl.seek(0);
    bubbleTl.play();
}



//var controlsActive = false;
var animationControls = $( "#animationControls" );
var toggleButton = $("#toggleAnimationControls");
function toggleAnimationControls(){
    if ( !animationControls.hasClass( 'toggled' )){
        toggleButton.find("i").addClass( 'up' );
        animationControls.addClass( 'toggled' );
    } else{
        animationControls.removeClass( 'toggled' );
        toggleButton.find("i").removeClass( 'up' );
    }
}


function setTimescale(slideAmount){
    if(slideAmount != 0){
        bubbleTl.timeScale(slideAmount);
    }

}

var currentFilterValue = 0;
function filterBubbles(value){
    var activeBubbles = $(".bubble.active");

    currentFilterValue = parseInt(value);
    document.getElementById("filterValue").innerHTML = currentFilterValue;
    activeBubbles.filter(function() {
        return $(this).attr("data-likes") < currentFilterValue;
    }).addClass("filtered");

    activeBubbles.filter(function() {
        return $(this).attr("data-likes") >= currentFilterValue;
    }).removeClass("filtered");
}

function clearBubbleStats(){
    document.getElementById("bubbleStat").innerHTML = "";
    document.getElementById("selectedDate").innerHTML = "";

}

function slideBubbleInfo(container, slideNum, dir){

    if(slideNum == 1){
        $(".slideContainer#slider-" + container + " .slide").removeClass( dir === 1 ? "move" : "moveOpposite" );
    } else if(slideNum == 2){
        $(".slideContainer#slider-" + container + " .slide").addClass( dir === 1 ? "move" : "moveOpposite" );
    }

}

var infoToggled = false;
function toggleAllInfo(){
    $(".oneHalf").toggleClass("hidden");
    infoToggled = !infoToggled;
}