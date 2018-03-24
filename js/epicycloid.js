var Epicycloid = function(R, r, d) {
  console.log ("Epicycloid ->", R, r, d );
  
  // officially a Epicycloid has R > r > d (in the analog world)
  this.R = R;
  this.r = r;
  this.d = d;

  this.MAX = 1000;

  this.fract = 0;

  this.init();
}

Epicycloid.prototype = {

    init: function() {
        console.log("Entering into Epicycloid::init");

        // console.log(Math.min( (this.r / gcd ( this.R, this.r ) ), 1000 ) * 2 * Math.PI);
        this.MAX = Math.min( (this.r / gcd ( this.R, this.r ) ), 1000 ) * 2 * Math.PI;

        this.fract = ( (this.R + this.r) / this.r);

        console.log("MAX=" + this.MAX + " :: fract=" + this.fract);
    },

    getNextXY: function(theta) {
        // console.log("Entering into Epicycloid::getNextXY -> theta=", theta);

        // This is based on https://en.wikipedia.org/wiki/Epicycloid
        var x = ( (this.R + this.r) * Math.cos(theta) ) - ( this.r * Math.cos( this.fract * theta) ) ;
        var y = ( (this.R + this.r) * Math.sin(theta) ) - ( this.r * Math.sin( this.fract * theta) ) ;

        x = this.zoomer(x);
        y = this.zoomer(y);

        // console.log(x,y);
        return new Coordinates(x, y);
    },

    zoomer: function(value) {
        return (value) + 350;
    },

    getMax: function() {
        return this.MAX;
    }
}