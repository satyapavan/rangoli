
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

  this.MAX = 1000;

  this.fract = 0;

  this.init();
}

Hypotrochoid.prototype = {

    init: function() {
        console.log("Entering into Hypotrochoid::init");

        // console.log(Math.min( (this.r / gcd ( this.R, this.r ) ), 1000 ) * 2 * Math.PI);
        this.MAX = Math.min( (this.r / gcd ( this.R, this.r ) ), 1000 ) * 2 * Math.PI;

        this.fract = ( (this.R - this.r) / this.r);

        console.log("MAX=" + this.MAX + " :: fract=" + this.fract);
    },

    getNextXY: function(theta) {
        // console.log("Entering into Hypotrochoid::getNextXY -> theta=", theta);

        // This is based on https://en.wikipedia.org/wiki/Hypotrochoid
        var x = ( (this.R - this.r) * Math.cos(theta) ) + ( this.d * Math.cos( this.fract * theta) ) ;
        var y = ( (this.R - this.r) * Math.sin(theta) ) - ( this.d * Math.sin( this.fract * theta) ) ;

        x = this.zoomer(x);
        y = this.zoomer(y);

        return new Coordinates(x, y);
    },

    zoomer: function(value) {
        return (value * 10) + 350;
    },

    getMax: function() {
        return this.MAX;
    }
}

var Draw = function() {
    console.log("Entering into Draw");

    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.strokeRect(20,20,150,100);
    this.ctx.strokeStyle = "rgba(255, 255, 51, 0.4)";
    this.ctx.lineWidth=4;
    this.theta = 0;
}

Draw.prototype = {
    plotFragment: function() {
        // console.log("Entering into plotFragment");

        var itr = 0;
        var objCoOrd;

        // without this begin and close path calls, the canvas is not cleared even with clearRect call.
        // this is very very irritating learning
        this.ctx.beginPath();
        do{
            // console.log(itr, this.theta, this.h.getMax());
            objCoOrd = this.h.getNextXY(this.theta);
            this.ctx.lineTo(objCoOrd.x, objCoOrd.y);
            this.ctx.stroke();
            this.ctx.moveTo(objCoOrd.x, objCoOrd.y);
            // this is the step size or increment. too low and there will be rough edges and too low will cause performance issues
            this.theta += (Math.PI / 7500);
            itr += 1;
        } while( itr <= 100 && this.theta <= this.h.getMax());
        this.ctx.closePath();

        if(this.theta >= this.h.getMax()) {
            clearInterval(this.oTimeout);
        }

        // console.log("Leaving plotFragment");
    },

    plot: function(h) {
        console.log("Entering into Draw::plot");

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.theta = 0; // radians

        this.h = h;

        this.oTimeout = setInterval(this.plotFragment.bind(this), 1000/48);

        console.log("Leaving Draw::plot");
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