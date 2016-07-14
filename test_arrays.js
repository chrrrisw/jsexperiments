var width = 10000;
var height = 1000;
var wxh = width*height;

var list = new Array(wxh);
var ab = new Uint16Array(wxh);
var num_iterations = 10;

if (typeof document !== 'undefined') {
    var draw_total = 0;
    var draw_number = 0;
    var canvas = document.getElementById('image_canvas');
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    var image_data = ctx.createImageData(canvas.width, canvas.height);

    var background_canvas = document.createElement('canvas');
    background_canvas.width = canvas.width;
    background_canvas.height = canvas.height;
    var background_ctx = background_canvas.getContext('2d');

    var zoom_factor = 1;

    // Create a colour scale mapped between 0 and 255
    var cs = chroma.scale('Viridis').mode('lab').domain([0, 255]);

    // Now cache the colours to optimise the access
    // Report how long it takes.
    var cs_cache = [];
    var c0 = performance.now();
    for (var i=0; i < 256; i++) {
        cs_cache.push(cs(i)._rgb);
    }
    var c1 = performance.now();
    console.log('Caching colourmap took:', c1-c0);

    // The minimum and maximum values for the data
    var data_min = 0;
    var data_max = 65535;

    // The minimum and maximum data values to map to the colour scale
    var scale_min = 0;
    var scale_max = 255;

} else {
    // Performance for nodejs
    console.log(process.hrtime());
    function Performance() {};
    Performance.prototype = Object.create(Object.prototype);
    Performance.prototype.constructor = Performance;
    Performance.prototype.now = function() {
        var hr = process.hrtime();
        return (hr[0] + hr[1] / 1e9) * 1000;
    };
    var performance = new Performance();
    do_it();
}

function init() {
    console.log('Initialising list and ab');
    for (var i = 0; i < wxh; i++) {
        list[i] = i % 256;
        ab[i] = i % 65536;
    }
}

// INTERESTING FINDINGS:
// Don't use a global variable for the loop iterator - it's twice as slow.

// WRITING USING FOR LOOPS

function write_list_for () {
    var d1, d2, diff;
    console.log('WRITE LIST FOR');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        for (var i = 0; i < wxh; i++) {
            list[i] = i;
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

function write_ab_for() {
    var d1, d2, diff;
    console.log('WRITE AB FOR');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        for (var i = 0; i < wxh; i++) {
            ab[i] = i;
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

// WRITING USING WHILE LOOPS

function write_list_while () {
    var d1, d2, diff;
    console.log('WRITE LIST WHILE');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        var i = wxh;
        while (i--) {
            list[i] = i;
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

function write_ab_while() {
    var d1, d2, diff;
    console.log('WRITE AB WHILE');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        var i = wxh;
        while (i--) {
            ab[i] = i;
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

// READING USING FOR LOOPS

function read_list_for () {
    var d1, d2, diff, r;
    console.log('READ LIST FOR');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        for (var i = 0; i < wxh; i++) {
            r = list[i];
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

function read_ab_for() {
    var d1, d2, diff, r;
    console.log('READ AB FOR');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        for (var i = 0; i < wxh; i++) {
            r = ab[i];
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

// READING USING WHILE LOOPS

function read_list_while () {
    var d1, d2, diff, r;
    console.log('READ LIST WHILE');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        var i = wxh;
        while (i--) {
            r = list[i];
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

function read_ab_while () {
    var d1, d2, diff, r;
    console.log('READ AB WHILE');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        var i = wxh;
        while (i--) {
            r = ab[i];
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

// Use iterators.

function write_list_in() {
    var d1, d2, diff;
    console.log('WRITE LIST IN');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        for (var i in list) {
            list[i] = i;
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

function write_ab_in() {
    var d1, d2, diff;
    console.log('WRITE AB IN');

    d1 = performance.now();
    for (var iter = 0; iter < num_iterations; iter++) {
        for (var i in ab) {
            ab[i] = i;
        }
    }
    d2 = performance.now();

    diff = d2 - d1;
    console.log('  Time:', diff);
    return diff / num_iterations;
}

function do_it() {
    init();

    document.getElementById('list_for').innerHTML = write_list_for();
    document.getElementById('list_while').innerHTML = write_list_while();
    document.getElementById('read_list_for').innerHTML = read_list_for();
    document.getElementById('read_list_while').innerHTML = read_list_while();
    // document.getElementById('list_in').innerHTML = write_list_in();

    document.getElementById('ab_for').innerHTML = write_ab_for();
    document.getElementById('ab_while').innerHTML = write_ab_while();
    document.getElementById('read_ab_for').innerHTML = read_ab_for();
    document.getElementById('read_ab_while').innerHTML = read_ab_while();
    // document.getElementById('ab_in').innerHTML = write_ab_in();
}

// While loop av over 50 draws is 19.108 ms
// For loop av over 50 draws is 19.956 ms
function draw_canvas() {
    var t0 = performance.now();
    var max_index = canvas.width * canvas.height * 4

    // Greyscale based upon ab
    // for (var index = 0; index <= max_index; index += 4) {
    //     image_data.data[index] = ab[index]; //red
    //     image_data.data[index + 1] = ab[index]; //green
    //     image_data.data[index + 2] = ab[index]; //blue
    //     image_data.data[index + 3] = 255;
    // }

    // Colourmap based upon ab
    // var c;
    // for (var index = 0; index <= max_index; index += 4) {
    //     c = cs(ab[index])._rgb;
    //     image_data.data[index] = c[0]; //red
    //     image_data.data[index + 1] = c[1]; //green
    //     image_data.data[index + 2] = c[2]; //blue
    //     image_data.data[index + 3] = 255;
    // }

    // Cached colourmap
    var v;
    for (var index = 0, data_index = 0; index <= max_index; index += 4, data_index++) {
        // Clamp the data between the min and max displayed values
        v = Math.min(scale_max, Math.max(scale_min, ab[data_index]));
        // Scale the clamped value between 0 and 255
        v = (255 *(v - scale_min) / (scale_max - scale_min)) | 0;
        image_data.data[index] = cs_cache[v][0]; //red
        image_data.data[index + 1] = cs_cache[v][1]; //green
        image_data.data[index + 2] = cs_cache[v][2]; //blue
        image_data.data[index + 3] = 255;
    }

    // var index = max_index + 4;
    // while (index -= 4) {
    //     image_data.data[index - 1] = 255;
    //     image_data.data[index - 2] = index % 255; //blue
    //     image_data.data[index - 3] = index % 127; //green
    //     image_data.data[index - 3] = index % 63; //red
    // }

    background_ctx.putImageData(image_data, 0, 0);
    // ctx.putImageData(image_data, 0, 0);
    ctx.scale(zoom_factor, zoom_factor);
    ctx.drawImage(background_canvas, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // var blob = new Blob([1,2,3]);
    // var image_bitmap =  createImageBitmap(blob).then(function(response){
    //     console.log(response);
    // });
    // ctx.fillRect(10, 10, 100, 100);
    // ctx.drawImage();
    var t1 = performance.now();
    draw_total += (t1-t0);
    draw_number += 1;
    document.getElementById('draw_time').innerHTML = (t1-t0);
    document.getElementById('av_draw_time').innerHTML = String(draw_total/draw_number) + " " + String(draw_number);
}

function zoom_in() {
    zoom_factor += 1;
    console.log(zoom_factor);
    draw_canvas();
}

function zoom_out() {
    zoom_factor -= 1;
    console.log(zoom_factor);
    draw_canvas();
}

function scale_up() {
    scale_min += 10;
    scale_max += 10;
    draw_canvas();
}

init();

// Colour scale
// - length 255
// - RGBA values (clamped 0-255)
// - AbsMin data value, AbsMax data value
// - CurrentMin data value, CurrentMax data value
//
// Any data value below CurrentMin uses colour 0
// Any data value above CurrentMax uses colour 255
//
console.log(cs(-10).rgba());
console.log(cs(0));
console.log(cs(255));
console.log(cs(265));
// Data array (unknown length) of data values (unknown)
console.log(255 % 256);
// console.log(cs_cache);
