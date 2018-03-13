
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
}

Draw.prototype = {
    plot: function(h) {
        console.log("Entering into Draw::plot", this.canvas);

        if(this.canvas !== undefined) {
            console.log(this.canvas.getContext("2d"));
            this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.canvas = document.getElementById("myCanvas");
        var ctx = this.canvas.getContext("2d");

        var objCoOrd;
        var theta = 0; // radians
        // for (var itr = 1; itr <= 180; itr += 1) {
        do{
            // console.log(itr);
            // theta = ( itr / (2 * Math.PI) );
            objCoOrd = h.getNextXY(theta);
            ctx.lineTo(objCoOrd.x, objCoOrd.y);
            ctx.stroke();
            ctx.moveTo(objCoOrd.x, objCoOrd.y);
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