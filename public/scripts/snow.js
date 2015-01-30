function microtime() {
    return new Date().getTime() * 0.001;
}

// returns a random integer from min to max
function irand(min, max) {
    return Math.floor((min || 0) + Math.random() * ((max + 1 || 100) - (min || 0)));
}

// returns a random float from min to max
function frand(min, max) {
    return (min || 0) + Math.random() * ((max || 1) - (min || 0));
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Two component vector class
function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;

    this.add = function(other) {
        this.x += other.x;
        this.y += other.y;
    }

    this.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

function Color(r, g, b) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
}


window.addEventListener('resize', function() {
    jsCanvasSnow.resize(window.innerWidth, window.innerHeight);
    jsCanvasSnow.init("snow", options);
}, false);

window.addEventListener('load', function() {
    //var options = {};
    var options = {
        'amount': 200,
        'size': [8, 20],
        'rotation': [1, 5],
        'speed': [40, 80],
        'swing': [0.1, 1],
        'amplitude': [30, 50],
        'alpha': [0.1, 0.95],
        'images': ["http://i.imgur.com/jbSVFgy.png", "http://i.imgur.com/TT2lmN4.png", "http://i.imgur.com/do8589m.png", "http://i.imgur.com/3BxEO8i.png"]
    };

    jsCanvasSnow.init("snow", options);
    jsCanvasSnow.start();
}, false);

function jsParticle(origin, velocity, size, amplitude, rspeed, alpha, image) {
    this.origin = origin;
    this.position = new Vector2(origin.x, origin.y);
    this.velocity = velocity || new Vector2(0, 0);
    this.size = size;
    this.rspeed = rspeed;
    this.amplitude = amplitude;
    this.alpha = alpha;
    this.image = image;

    this.dx = Math.random() * 100;
    this.rotation = Math.random() * 360;

    this.update = function(delta_time) {
        this.dx += this.velocity.x * delta_time;
        this.position.y += this.velocity.y * delta_time;
        this.position.x = this.origin.x + (this.amplitude * Math.sin(this.dx));
        this.rotation += this.rspeed * delta_time;
    }
}

var jsCanvasSnow = {
    canvas: null,
    ctx: null,
    particles: [],
    running: false,

    pImageObjects: [],

    start_time: 0,
    frame_time: 0,

    init: function(canvas_id, options) {
        // use the container width and height
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext('2d');
        this.resize(window.innerWidth, window.innerHeight);

        // default values
        this.pAmount = options.amount || 500;
        this.pSize = options.size || [8, 26];
        this.pRotation = options.rotation || [-5, 5];
        this.pSwing = options.swing || [0.1, 1];
        this.pSpeed = options.speed || [40, 100],
            this.pAmplitude = options.amplitude || [20, 50];
        this.pAlpha = options.alpha || [0.25, 1];
        this.pImageNames = options.images || [];

        // initialize all the images
        for (var i = 0; i < this.pImageNames.length; i++) {
            var image = new Image();
            image.src = this.pImageNames[i];
            this.pImageObjects.push(image);
        }

        this._init_particles();
    },

    start: function() {
        this.running = true;
        this.start_time = this.frame_time = microtime();
        this._loop();
    },

    stop: function() {
        this.running = false;
    },

    resize: function(w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
    },

    _loop: function() {
        if (jsCanvasSnow.running) {
            jsCanvasSnow._clear();
            jsCanvasSnow._update();
            jsCanvasSnow._draw();
            jsCanvasSnow._queue();
        }
    },

    _init_particles: function() {
        // clear the particles array
        this.particles.length = 0;

        for (var i = 0; i < this.pAmount; i++) {
            var origin = new Vector2(frand(0, this.canvas.width), frand(-this.canvas.height, 0));
            var velocity = new Vector2(frand(this.pSwing[0], this.pSwing[1]), frand(this.pSpeed[0], this.pSpeed[1]));
            var size = frand(this.pSize[0], this.pSize[1]);
            var amplitude = frand(this.pAmplitude[0], this.pAmplitude[1]);
            var rspeed = frand(this.pRotation[0], this.pRotation[1]) * ((Math.random() < 0.5) ? -1 : 1);
            var alpha = frand(this.pAlpha[0], this.pAlpha[1]);
            var image = (this.pImageObjects.length > 0) ? irand(0, this.pImageObjects.length - 1) : -1;

            this.particles.push(new jsParticle(origin, velocity, size, amplitude, rspeed, alpha, image));
        }
    },

    _update: function() {
        var now_time = microtime();
        var delta_time = now_time - this.frame_time;

        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];
            particle.update(delta_time);

            if (particle.position.y - particle.size > this.canvas.height) {
                particle.position.y = -particle.size * 2;
                particle.position.x = particle.origin.x = Math.random() * this.canvas.width;
            }
        }

        this.frame_time = now_time;
    },

    _draw: function() {
        this.ctx.fillStyle = 'rgb(255,255,255)';

        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];
            var center = -(particle.size / 2);

            this.ctx.save();
            this.ctx.translate(particle.position.x, particle.position.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.globalAlpha = this.particles[i].alpha;

            if (particle.image == -1)
                this.ctx.fillRect(center, center, particle.size, particle.size);
            else
                this.ctx.drawImage(this.pImageObjects[particle.image], center, center, particle.size, particle.size);

            this.ctx.restore();
        }
    },

    _clear: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    _queue: function() {
        window.requestAnimationFrame(jsCanvasSnow._loop);
    },
}