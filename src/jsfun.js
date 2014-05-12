// Figuren und Noten.
//
// (C) 2014 Stefan Haustein, Zürich
// Lizenz: Apache 2.0; siehe http://tidej.net/jssum/LICENSE.
// Einbinden direkt nach jssum.js 


// ======================================================================= Figur


/**
 * Erzeugt eine neue Figur.
 * 
 * @param {string} url URL des Bildes für die Figur.
 * @param {number} breite Breite der Figur.
 * @param {number} hoehe Höhe der Figur.
 * @constructor
 */
var Figur = window.Figur = function(url, breite, hoehe) {
    this.img = document.createElement("div");
    this.img.style.backgroundRepeat = 'no-repeat';
    //this.img.style.backgroundPosition = 'center center';
    this.img.style.backgroundSize = '100% 100%';
    this.img.style.backgroundImage = 'url(' + url + ')';
    this.img.style.position = 'absolute';
    this.img.style.top = '0';
    this.img.style.left = '0';
    this.img.style.webkitTransformOrigin = '50% 50%';
    this.img.style.transformOrigin = '50% 50%';
    this.img.style.overflow = 'hidden';
    this.img.style.pointerEvents = 'none';
    this.winkel = 0;
    this.setzeGroesse(breite, hoehe);
    this.bewegeBis(0, 0);
    window.bildschirm.container.appendChild(this.img);
};

/**
 * Setzt die Grösse der Figur.
 * 
 * @param {number} breite Die neue Breite der Figur.
 * @param {number} hoehe Die neue Hoehe der Figur.
 */
Figur.prototype.setzeGroesse = function (breite, hoehe) {
    this.w = breite;
    this.h = hoehe;
    this.img.style.width = (breite * window.bildschirm.scalePercentX) + '%';
    this.img.style.height = (hoehe * window.bildschirm.scalePercentY) + '%';
};

/**
 * Bewege den Mittelpunkt der Figur an die angegebenen Koordinaten, relativ
 * zur linken oberen Ecke des Zeichenbereichs.
 * 
 * @param {number} x Die horizontale Komponente der Position.
 * @param {number} y Die vertikale Komponente der Position.
 */
Figur.prototype.bewegeBis = function (x, y) {
    this.x = x;
    this.y = y;
    this.img.style.left = 
        (x - this.w / 2) * window.bildschirm.scalePercentX + '%';

    this.img.style.top = 
        (y - this.h / 2) * window.bildschirm.scalePercentY + '%';
        
    var t = 'rotate(' + this.winkel + 'deg)';
//    window.console.log(t);
    this.img.style.webkitTransform = t;
    this.img.style.transform = t;
};

Figur.prototype.bewegeUm = function(distanz) {
    var dx = distanz * Math.sin((this.winkel + 90) * Math.PI / 180);
    var dy = distanz * Math.cos((this.winkel + 90) * Math.PI / 180);
    this.bewegeBis(this.x + dx, this.y + dy);
};

Figur.prototype.dreheBis = function(winkel) {
    this.winkel = winkel;
};

Figur.prototype.dreheUm = function(winkel) {
    this.dreheBis(this.winkel + winkel);
};

Figur.prototype.dreheZu = function(x, y) {
    this.dreheBis(Math.atan2(x - this.x, y - this.y) * 180 / Math.PI);
};

/**
 * Liefert die horizontale Position des Mittelpunkts dieser Figur
 * @return {number}
 */
Figur.prototype.hPosition = function () {
    return this.x;
};

/**
 * Liefert die vertikale Position des Mittelpunkts dieser Figur
 * @return {number}
 */
Figur.prototype.vPosition = function () {
    return this.y;
};

/**
 * Liefert die Breite dieser Figur
 * @return {number}
 */
Figur.prototype.breite = function() {
    return this.w;
};

/**
 * Liefert die Höhe dieser Figur
 * @return {number}
 */
Figur.prototype.hoehe = function() {
    return this.h;
};

/**
 * Macht diese Figur unsichtbar (siehe auch 'zeige()').
 */
Figur.prototype.verstecke = function() {
    this.img.style.display = 'none';
};

/**
 * Macht diese Figur sichtbar (siehe auch 'verstecke()').
 */
Figur.prototype.zeige = function() {
    this.img.style.display = 'block';
};

/**
 * Liefert true falls diese Figur mit der Parameterfigur kollidiert. Für
 * die Berechnung wird eine kreisförmige Figur mit 90% der kleineren
 * Seitenlänge als Durchmesser angenommen.
 * 
 * @param {Figur} figur2
 * @return {boolean}
 */
Figur.prototype.kollidiertMit = function(figur2) {
    var abstandX = this.x - figur2.x;
    var abstandY = this.y - figur2.y;
    
    var abstandSqr = abstandX * abstandX + abstandY * abstandY;
    var mindestAbstand = (Math.min(this.w, this.h) + 
        Math.min(figur2.w, figur2.h)) * 0.9 / 2;
    
    return abstandSqr < mindestAbstand * mindestAbstand;
};

/**
 * Gibt die Figur frei.
 */
Figur.prototype.gibFrei = function() {
    this.img.parentNode.removeChild(this.img);
};


// ======================================================================= Sound

/**
 * Erstellt einen neues Sound-Objekt aus der angegbenen URL.
 */
var Sound = window.Sound = function(url) {
    this.element = document.createElement('audio');
    this.element.setAttribute('src', url);
    document.getElementsByTagName('body')[0].appendChild(this.element);
};

/**
 * Spielt den Sound ab.
 */
Sound.prototype.spiele = function() {
    this.element.pause();
    this.element.currentTime = 0;
    this.element.play();
};





