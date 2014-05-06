// Load this at the end of the body element before your own code.

var Bildschirm = function() {
    document.getElementsByTagName("html")[0].style.height = "100%";

    this.body = document.getElementsByTagName("body")[0];
    this.body.style.border = 0;
    this.body.style.padding = 0;
    this.body.style.margin = 0;
    this.body.style.height = "100%";
    this.body.style.overflow = "hidden";
    this.body.style.backgroundColor = "black";
    this.scale = 1;
  
    this.container = document.getElementById("jssum-container");
    if (this.container == null) {
        this.container = document.createElement("div");
        this.container.setAttribute("id", "jssum-container");
        this.container.style.position = "absolute";
        this.container.style.overflow = "hidden";
        this.body.appendChild(this.container);
        
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "jssum-bildschirm");
        this.container.appendChild(this.canvas);
        this.canvas.style.backgroundColor = "white";
    } else {
        this.canvas = document.getElementById("jssum-canvas");
    }
    
    this.app = null;
    this.fixedWidth = 0;
    this.fixedHeight = 0;
    this.justiereGroesse();
  
    this.canvas.onclick = function(event) {
        window.console.log("click", bildschirm);
        if (bildschirm.app != null && 
            bildschirm.app.bearbeiteMausKlick != null) {
            window.console.log("clack");
            if (!event) {
                event = window.event;
            }
            var x = event.pageX - window.bildschirm.canvas.offsetLeft; 
            var y = event.pageY - window.bildschirm.canvas.offsetTop;
            bildschirm.app.bearbeiteMausKlick(x, y);
        }  
    }
    
    window.onresize = function() {
        bildschirm.justiereGroesse();
    };

};

Bildschirm.prototype.justiereGroesse = function() {
    var targetWidth = this.fixedWidth <= 0 ? this.body.offsetWidth : this.fixedWidth;
    var targetHeight = this.fixedHeight <= 0 ? this.body.offsetHeight : this.fixedHeight;
    
    if (targetHeight != this.canvas.height || 
        targetWidth != this.canvas.width) {
        this.canvas.width = targetWidth;
        this.canvas.height = targetHeight;
    }
    
    var scaleX = this.body.offsetWidth / targetWidth;
    var scaleY = this.body.offsetHeight / targetHeight;
    
    this.scale = Math.min(scaleX, scaleY);
    
    var scaledWidth = targetWidth * this.scale;
    var scaledHeight = targetHeight * this.scale;
    
    this.canvas.style.width = this.container.style.width = scaledWidth + "px";
    this.canvas.style.height = this.container.style.height = scaledHeight + "px";
    this.container.style.left = (this.body.offsetWidth - scaledWidth) / 2;
    this.container.style.top = (this.body.offsetHeight - scaledHeight) / 2;
}

Bildschirm.prototype.hoehe = function() {
    return this.canvas.height;
};

Bildschirm.prototype.breite = function() {
    return this.canvas.width;
};

Bildschirm.prototype.setzeGroesse = function(w, h) {
    this.fixedWidth = w;
    this.fixedHeight = h;
    this.justiereGroesse();
};

Bildschirm.prototype.setzeHintergrundbild = function(url) {
    this.canvas.style.background = "url(" + url + ") center center no-repeat";
    this.canvas.style.backgroundSize = "cover";
} 


Bildschirm.prototype.starteApplikation = function(app) {
    this.app = app;
    this.justiereGroesse();
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    window.setInterval(function() {
        if (app.bearbeiteUpdate) {
            app.bearbeiteUpdate();
        }
    }, 33);
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




