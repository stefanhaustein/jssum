// SuM JavaScript Port 
//
// (c) 2014 Stefan Haustein, Zürich
// Lizenz: Apache 2.0; siehe http://tidej.net/jssum/LICENSE.
//
// Bitte via Script-Tag am Ende des Body-Elements einbinden; 
// Beispiel: http://tidej.net/jssum/beispiel/haus-des-nikolaus.html

// ================================================================== Bildschirm


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
    this.scalePercentX = 1;
    this.scalePercentY = 1;
  
    this.container = document.getElementById("jssum-container");
    if (!this.container) {
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
  
    var self = this;
    this.canvas.onclick = function(event) {
        self.delegateMouseEvent(event, "bearbeiteMausKlick");
    };
    this.canvas.onmousedown = function(event) {
        self.delegateMouseEvent(event, "bearbeiteMausDruck");
    };
    this.canvas.onmouseup = function(event) {
        self.delegateMouseEvent(event, "bearbeiteMausLos");
    };
    this.canvas.onmousemove = function(event) {
        self.delegateMouseEvent(event, "bearbeiteMausBewegt");
    };
    
    // Our default error handler just re-throws.
    this.onError = function(error) {
        throw error;
    };
    
    window.onresize = function() {
        self.justiereGroesse();
    };

};

Bildschirm.prototype.delegateMouseEvent = function(event, appMethodName) {
    try {
        var method = this.app && this.app[appMethodName];
        if (!method) {
            return;
        }
        if (!event) {
            event = window.event;
        }
        var x = event.pageX - window.bildschirm.canvas.offsetLeft; 
        var y = event.pageY - window.bildschirm.canvas.offsetTop;
        method.call(this.app, x, y);
    } catch (e) {
        this.onError(e);
    }
    
};

Bildschirm.prototype.justiereGroesse = function() {
    var targetWidth = this.fixedWidth <= 0 ?
        this.body.offsetWidth : this.fixedWidth;
    var targetHeight = this.fixedHeight <= 0 ? 
        this.body.offsetHeight : this.fixedHeight;
    
    var requestUpdate = false;
    if (targetHeight != this.canvas.height ||
        targetWidth != this.canvas.width) {
        this.canvas.width = targetWidth;
        this.canvas.height = targetHeight;
        requestUpdate = true;
    }
    
    var scaleX = this.body.offsetWidth / targetWidth;
    var scaleY = this.body.offsetHeight / targetHeight;
    
    this.scale = Math.min(scaleX, scaleY);
    this.scalePercentX = 100 / targetWidth;
    this.scalePercentY = 100 / targetHeight;
    
    var scaledWidth = targetWidth * this.scale;
    var scaledHeight = targetHeight * this.scale;
    
    this.canvas.style.width = this.container.style.width = scaledWidth + "px";
    this.canvas.style.height = 
        this.container.style.height = scaledHeight + "px";
    this.container.style.left = (this.body.offsetWidth - scaledWidth) / 2;
    this.container.style.top = (this.body.offsetHeight - scaledHeight) / 2;
    
    if (requestUpdate && this.app && this.app.bearbeiteUpdate) {
        try {
            this.app.bearbeiteUpdate();
        } catch (e) {
            this.onError(e);
        }
    }
};

/**
 * Die Hoehe des Zeichenbereichs in pixeln.
 * @return {number}
 */
Bildschirm.prototype.hoehe = function() {
    return this.canvas.height;
};

/**
 * Die Breite des Zeichenbereichs in pixeln.
 * @return {number}
 */
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
};

Bildschirm.prototype.setzeFarbe = function(farbe) {
    if (typeof farbe === "number") {
        farbe = 'rgb(' + ((farbe >> 16) & 0xff) + ',' +
            ((farbe >> 8) & 0xff) + ',' + (farbe & 0xff) + ')';
    }
    this.canvas.style.background = farbe;
};

Bildschirm.prototype.loescheAlles = function() {
    this.canvas.getContext("2d").clearRect(
        0, 0, this.canvas.width, this.canvas.height);
};

Bildschirm.prototype.zeichneDich = function() {
    // No-Op
};

Bildschirm.prototype.starteApplikation = function(app) {
    if (this.app) {
        throw("Applikation bereits gestartet!");
    }
    this.app = app;

    var self = this;
    this.timerId = window.setInterval(function() {
        if (self.app.bearbeiteLeerlauf) {
            try {
                self.app.bearbeiteLeerlauf();
            } catch (e) {
                window.clearTimeout(self.timerId);
                self.onError(e);
            }
        }
    }, 33);
};

window.bildschirm = new Bildschirm();


// ======================================================================= Stift


/**
 * Erzeuge einen neuen Sitft. Ausgangszustand ist (0,0) unten normal. 
 * @constructor
 */
var Stift = window.Stift = function() {
    this.context = window.bildschirm.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;
    this.winkel = 0;
    this.unten = false;
};

/**
 * Bewege den stift zu den angegebenen Koordinaten. Zeichne eine entsprechende
 * Linie falls unten.
 * 
 * @param{number} hPos horizontale Zielposition
 * @param{number} vPos vertikale Zielposition
 */
Stift.prototype.bewegeBis = function(x, y) {
    if (this.unten) {
        this.zeichneLinie(this.x, this.y, x, y);
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

Stift.prototype.dreheZu = function(x, y) {
    this.winkel = Math.atan2(x - this.x, y - this.y) * 180 / Math.PI;
};

Stift.prototype.gibFrei = function() {
    // No-Op 
};

Stift.prototype.hoch = function() {
    this.unten = false;
};

Stift.prototype.hPosition = function() {
    return this.y;
};

Stift.prototype.istUnten = function() {
    return this.unten;
};

Stift.prototype.normal = function() {
    this.context.globalCompositeOperation = "none";
};

Stift.prototype.radiere = function() {
    this.context.globalCompositeOperation = "destination-out";
};

Stift.prototype.runter = function() {
    this.unten = true;
};

Stift.prototype.schreibeText = function(text) {
    this.context.fillText(text, this.x, this.y);
};

Stift.prototype.schreibeZahl = function(zahl) {
    this.schreibeText("" + zahl);
};

Stift.prototype.vPosition = function() {
    return this.x;
};

Stift.prototype.wechsle = function() {
    this.context.globalCompositeOperation = "xor";
};

Stift.prototype.winkel = function() {
    return this.winkel;
};

Stift.prototype.zeichneKreis = function(radius) {
    this.context.beginPath();
    this.context.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
    this.context.stroke();
};

Stift.prototype.zeichneLinie = function(x1, y1, x2, y2) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
};

Stift.prototype.zeichneRechteck = function(breite, hoehe) {
    this.context.beginPath();
    this.context.rect(this.x, this.y, breite, hoehe);
    this.context.stroke();
};

