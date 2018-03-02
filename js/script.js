
var Coordinates = function(x, y) {
    console.log("Entering into Coordinates::", x, y);

    this.x = x;
    this.y = y;
}

var Hypotrochoid = function(R, r, d) {
  console.log ("Hypotrochoid ->", R, r, d );
  
  // officially a hypotrochoid has R > r > d (in the analog world)
  this.R = 10; // R;
  this.r = 5; // r;
  this.d = 1; // d;

  this.init();
}

Hypotrochoid.prototype = {

    init: function() {
        console.log("Entering into Hypotrochoid::init");
    },

    getNextXY: function(theta) {
        console.log("Entering into Hypotrochoid::getNextXY -> theta=", theta);

        // This is based on https://en.wikipedia.org/wiki/Hypotrochoid
        var x = ( (this.R - this.r) * Math.cos(theta) ) + ( this.d * Math.cos( ( (this.R - this.r) / this.r) * theta) ) ;
        var y = ( (this.R - this.r) * Math.sin(theta) ) - ( this.d * Math.sin( ( (this.R - this.r) / this.r) * theta) ) ;

        return new Coordinates(x, y);
    }
}

var Draw = function() {
    console.log("Entering into Draw");
}

Draw.prototype = {
    plot: function(h) {
        console.log("Entering into Draw::plot");

        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.moveTo(250,250);

        var objCoOrd;
        for (var itr = 1; itr <= 360; ++itr) {
            theta = ( (2 * Math.PI) / itr );
            objCoOrd = h.getNextXY(theta);
            ctx.lineTo(( 10 * objCoOrd.x) + 500, ( 10 * objCoOrd.y) + 500);
            ctx.stroke();
            ctx.moveTo(( 10 * objCoOrd.x) + 500, ( 10 * objCoOrd.y) + 500);
        }

    }
}

function startRangoli() {
	console.log("Entering into startRangoli");

    var varOuterR   = document.getElementById("outer_R");
    var varInnerR   = document.getElementById("inner_r");
    var varDistance = document.getElementById("distance");

    h = new Hypotrochoid(varOuterR.value, varInnerR.value, varDistance.value);
    var objDraw = new Draw();
    objDraw.plot(h);

    varOuterR.onchange = function() {
        h = new Hypotrochoid(this.value, varInnerR.value, varDistance.value);
    }
    varInnerR.onchange = function() {
        h = new Hypotrochoid(varOuterR.value, this.value, varDistance.value);
    }
    varDistance.onchange = function() {
        h = new Hypotrochoid(varOuterR.value, varInnerR.value, this.value);
    }

}

window.addEventListener("DOMContentLoaded", startRangoli, false);