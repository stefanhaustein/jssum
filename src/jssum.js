// Load this at the end of the body element before your own code.

var Bildschirm = function() {
  document.getElementsByTagName("html")[0].style.height = "100%";

  this.body = document.getElementsByTagName("body")[0];
  this.body.style.border = 0;
  this.body.style.padding = 0;
  this.body.style.margin = 0;
  this.body.style.height = "100%";
  this.body.style.overflow = "hidden";
  
  this.canvas = document.createElement("canvas");
  // this.canvas.style.backgroundColor = "#ddd";
  this.canvas.width = this.body.offsetWidth;
  this.canvas.height = this.body.offsetHeight;

  this.body.appendChild(this.canvas);
};

Bildschirm.prototype.hoehe = function() {
  return this.canvas.offsetHeight;
};

Bildschirm.prototype.breite = function() {
  return this.canvas.offsetWidth;
};

window.bildschirm = new Bildschirm();

var Stift = window.Stift = function() {
  this.context = window.bildschirm.canvas.getContext("2d");
  this.x = 0;
  this.y = 0;
  this.winkel = 0;
  this.aktiv = false;
};

Stift.prototype.bewegeBis = function(x, y) {
  console.log("bewegebis ", x, y, this.aktiv);
  if (this.aktiv) {
    this.context.beginPath();
    this.context.moveTo(this.x, this.y);
    this.context.lineTo(x, y);
    this.context.closePath();
    this.context.stroke();
  }
  this.x = x;
  this.y = y;
};

Stift.prototype.bewegeUm = function(distanz) {
  var dx = distanz * Math.sin((this.winkel + 90) * Math.PI / 180);
  var dy = distanz * Math.cos((this.winkel + 90) * Math.PI / 180);
  this.bewegeBis(this.x + dx, this.y + dy);
};

Stift.prototype.dreheBis = function(winkel) {
  this.winkel = winkel;
};

Stift.prototype.dreheUm = function(winkel) {
  this.winkel += winkel;
};

Stift.prototype.hoch = function() {
  this.aktiv = false;
};

Stift.prototype.hPosition = function() {
  return this.y;
};

Stift.prototype.vPosition = function() {
  return this.x;
};

Stift.prototype.runter = function() {
  this.aktiv = true;
};

Stift.prototype.winkel = function() {
  return this.winkel;
};


