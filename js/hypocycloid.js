var Hypocycloid = function(R, r, d) {
  console.log ("Hypocycloid ->", R, r, d );
  
  // officially a Hypocycloid has R > r > d (in the analog world)
  this.R = R;
  this.r = r;
  this.d = d;

  this.MAX = 1000;

  this.fract = 0;

  this.init();
}

Hypocycloid.prototype = {

    init: function() {
        console.log("Entering into Hypocycloid::init");

        // console.log(Math.min( (this.r / gcd ( this.R, this.r ) ), 1000 ) * 2 * Math.PI);
        this.MAX = Math.min( (this.r / gcd ( this.R, this.r ) ), 1000 ) * 2 * Math.PI;

        this.fract = ( (this.R - this.r) / this.r);

        console.log("MAX=" + this.MAX + " :: fract=" + this.fract);
    },

    getNextXY: function(theta) {
        // console.log("Entering into Hypocycloid::getNextXY -> theta=", theta);

        // This is based on https://en.wikipedia.org/wiki/Hypocycloid
        var x = ( (this.R - this.r) * Math.cos(theta) ) + ( this.r * Math.cos( this.fract * theta) ) ;
        var y = ( (this.R - this.r) * Math.sin(theta) ) - ( this.r * Math.sin( this.fract * theta) ) ;

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