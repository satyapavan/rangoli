
var Hypotrochoid = function(R, r, d) {
  console.log ( R,r,d )
  
  // officially a hypotrochoid has R > r > d (in the analog world)
  this.R = R;
  this.r = r;
  this.d = d;

  this.init();
}

function startRangoli() {
	console.log("Entering into startRangoli");
}

window.addEventListener("DOMContentLoaded", startRangoli, false);