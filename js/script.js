
var Coordinates = function(x, y) {
    // console.log("Entering into Coordinates::", x, y);

    this.x = x;
    this.y = y;
}

var Hypotrochoid = function(R, r, d) {
  console.log ("Hypotrochoid ->", R, r, d );
  
  // officially a hypotrochoid has R > r > d (in the analog world)
  this.R = R;
  this.r = r;
  this.d = d;

  this.init();
}

Hypotrochoid.prototype = {

    init: function() {
        console.log("Entering into Hypotrochoid::init");
    },

    getNextXY: function(theta) {
        // console.log("Entering into Hypotrochoid::getNextXY -> theta=", theta);

        // This is based on https://en.wikipedia.org/wiki/Hypotrochoid
        var x = ( (this.R - this.r) * Math.cos(theta) ) + ( this.d * Math.cos( ( (this.R - this.r) / this.r) * theta) ) ;
        var y = ( (this.R - this.r) * Math.sin(theta) ) - ( this.d * Math.sin( ( (this.R - this.r) / this.r) * theta) ) ;

        x = this.zoomer(x);
        y = this.zoomer(y);

        return new Coordinates(x, y);
    },

    zoomer: function(value) {
        return (value * 10) + 300;
    },

    getMax: function() {
        // console.log(Math.min( (this.r / gcd ( this.R, this.r ) ), 1000 ) * 2 * Math.PI);
        return Math.min( (this.r / gcd ( this.R, this.r ) ), 1000 ) * 2 * Math.PI;
    }
}

var Draw = function() {
    console.log("Entering into Draw");
    var canvas;
    var ctx;
}

Draw.prototype = {
    plot: function(h) {
        console.log("Entering into Draw::plot");

        if(this.canvas === undefined) {
            this.canvas = document.getElementById("myCanvas");
            this.ctx = this.canvas.getContext("2d");
        }

        console.log(this.canvas.getContext("2d"));
        console.log(this.canvas, this.ctx);
        console.log(this.canvas.width, this.canvas.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var objCoOrd;
        var theta = 0; // radians
        // for (var itr = 1; itr <= 180; itr += 1) {
        do{
            // console.log(itr);
            // theta = ( itr / (2 * Math.PI) );
            objCoOrd = h.getNextXY(theta);
            this.ctx.lineTo(objCoOrd.x, objCoOrd.y);
            this.ctx.stroke();
            this.ctx.moveTo(objCoOrd.x, objCoOrd.y);
            theta += (Math.PI / 100);
        } while( theta <= h.getMax());
    }
}

function startRangoli() {
	console.log("Entering into startRangoli");

    var varOuterR   = document.getElementById("outer_R");
    var varInnerR   = document.getElementById("inner_r");
    var varDistance = document.getElementById("distance");

    var objDraw = new Draw();

    h = new Hypotrochoid(varOuterR.value, varInnerR.value, varDistance.value);
    objDraw.plot(h);

    varOuterR.onchange = function() {
        h = new Hypotrochoid(this.value, varInnerR.value, varDistance.value);
        objDraw.plot(h);
    }
    varInnerR.onchange = function() {
        h = new Hypotrochoid(varOuterR.value, this.value, varDistance.value);
        objDraw.plot(h);
    }
    varDistance.onchange = function() {
        h = new Hypotrochoid(varOuterR.value, varInnerR.value, this.value);
        objDraw.plot(h);
    }

}

window.addEventListener("DOMContentLoaded", startRangoli, false);

var gcd = function(a, b) {
  if ( ! b) {
    // console.log("GCD: = ", a);
    return a;
  }
  return gcd(b, a % b);
};

/**
 * This is the function that will take care of image extracting and
 * setting proper filename for the download.
 * IMPORTANT: Call it from within a onclick event.
*/
function downloadCanvas(link, canvasId, filename) {
    console.log("Entering into downloadCanvas with values:", link, canvasId, filename);
    link.href = document.getElementById(canvasId).toDataURL('image/png');
    link.download = filename;
    console.log(link.href);

}

/** 
 * The event handler for the link's onclick event. We give THIS as a
 * parameter (=the link element), ID of the canvas and a filename.
*/
document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'myCanvas', 'rangoli.png');
}, false);