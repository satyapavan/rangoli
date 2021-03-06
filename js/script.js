
var Coordinates = function(x, y) {
    // console.log("Entering into Coordinates::", x, y);

    this.x = x;
    this.y = y;
}

var Draw = function(pShape) {
    console.log("Entering into Draw for ", pShape);

    this.canvas = document.getElementById(pShape + "-Canvas");

    // Since we are using paper.js now, no need to use to ctx anymore. 
    // and the images are more crisp and clear too

    // this.ctx = this.canvas.getContext("2d");
    // this.ctx.translate(0.5,0.5);
    // this.ctx.strokeRect(20,20,150,100);
    // this.ctx.strokeStyle = "rgba(255, 255, 51, 0.4)";
    // this.ctx.lineWidth=2;
    // this.theta = 0;

    // Create an empty project and a view for the canvas:
    paper.setup(this.canvas);
    // Create a Paper.js Path to draw a line into it:
    this.path = new paper.Path({
        strokeColor : 'yellow',
        strokeWidth : "2",
        shadowColor : 'red',
        shadowBlur  : 12
    });
}

Draw.prototype = {
    plotFragment: function() {
        // console.log("Entering into plotFragment");

        var itr = 0;
        var objCoOrd;

        // without this begin and close path calls, the canvas is not cleared even with clearRect call.
        // this is very very irritating learning
        // this.ctx.beginPath();
        do{
            // console.log(itr, this.theta, this.h.getMax());
            objCoOrd = this.h.getNextXY(this.theta);

            this.path.add(new paper.Point(objCoOrd.x, objCoOrd.y));

            // this.ctx.lineTo(objCoOrd.x, objCoOrd.y);
            // this.ctx.stroke();
            // this.ctx.moveTo(objCoOrd.x, objCoOrd.y);

            // this is the step size or increment. too low and there will be rough edges and too low will cause performance issues
            // with paper.js, 7500 is reduced to 1500. even its working with 500, but the speed is too high for an animation
            this.theta += (Math.PI / 1500);
            itr += 1;
        } while( itr <= 100 && this.theta <= this.h.getMax());
        // this.ctx.closePath();

        if(this.theta >= this.h.getMax()) {
            clearInterval(this.oTimeout);
            this.oTimeout = null;
        }

        // console.log("Leaving plotFragment");
    },

    plot: function(h) {
        console.log("Entering into Draw::plot");

        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.theta = 0; // radians

        this.h = h;

        this.oTimeout = setInterval(this.plotFragment.bind(this), 1000/48);

        console.log("Leaving Draw::plot");
    }
}

function ShapeFactory(type, oR, ir, d) {
    if( type === "Hypocycloid")
        return new Hypocycloid(oR, ir, d);
    if( type === "Hypotrochoid")
        return new Hypotrochoid(oR, ir, d);
    if( type === "Epicycloid")
        return new Epicycloid(oR, ir, d);
    else
        return null;
}

function startRangoli() {
	console.log("Entering into startRangoli");

    var varOuterR   = document.getElementById("outer_R");
    var varInnerR   = document.getElementById("inner_r");
    var varDistance = document.getElementById("distance");

    document.getElementById("oR").innerHTML= varOuterR.value;
    document.getElementById("ir").innerHTML= varInnerR.value;
    document.getElementById("d").innerHTML= varDistance.value;

    var aShapes = ["Hypocycloid", "Hypotrochoid" ]; // , "Epicycloid" ];
    var aDraw = []; // this will contain the Draw objects, so that they can be modified during later activities.

    for( var itrShape = 0; itrShape < aShapes.length; itrShape++) {
        var objShape = ShapeFactory(aShapes[itrShape], varOuterR.value, varInnerR.value, varDistance.value);

        aDraw[itrShape] = new Draw(aShapes[itrShape]);
        aDraw[itrShape].plot(objShape);
    }

    varOuterR.onchange = function() {        
        document.getElementById("oR").innerHTML= this.value;

        for( var itrShape = 0; itrShape < aShapes.length; itrShape++) {
            var objShape = ShapeFactory(aShapes[itrShape], this.value, varInnerR.value, varDistance.value);
                   
            // clear any traces of previous events
            if( aDraw[itrShape].oTimeout != null ) {
                clearInterval(aDraw[itrShape].oTimeout);
            }

            // then start again with a new object
            aDraw[itrShape] = new Draw(aShapes[itrShape]);
            aDraw[itrShape].plot(objShape);
        }
    }
    varInnerR.onchange = function() {
        document.getElementById("ir").innerHTML= this.value;

        for( var itrShape = 0; itrShape < aShapes.length; itrShape++) {
            var objShape = ShapeFactory(aShapes[itrShape], varOuterR.value, this.value, varDistance.value);
          
            // clear any traces of previous events
            if( aDraw[itrShape].oTimeout != null ) {
                clearInterval(aDraw[itrShape].oTimeout);
            }

            // then start again with a new object
            aDraw[itrShape] = new Draw(aShapes[itrShape]);
            aDraw[itrShape].plot(objShape);
        }
    }
    varDistance.onchange = function() {
        document.getElementById("d").innerHTML= this.value;

        for( var itrShape = 0; itrShape < aShapes.length; itrShape++) {
            var objShape = ShapeFactory(aShapes[itrShape], varOuterR.value, this.value, varDistance.value);
          
            // clear any traces of previous events
            if( aDraw[itrShape].oTimeout != null ) {
                clearInterval(aDraw[itrShape].oTimeout);
            }

            // then start again with a new object
            aDraw[itrShape] = new Draw(aShapes[itrShape]);
            aDraw[itrShape].plot(objShape);
        }
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
    var filename = 'R' + document.getElementById("outer_R").value
        + '-r' + document.getElementById("inner_r").value
        + '-d' + document.getElementById("distance").value
        + '.png' ;

    downloadCanvas(this, 'Hypocycloid-Canvas', "Rangoli-Hypocycloid-" + filename );
    downloadCanvas(this, 'Hypotrochoid-Canvas', "Rangoli-Hypotrochoid-" + filename );
}, false);