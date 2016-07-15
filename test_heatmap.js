var width = 10000;
var height = 1000;
var wxh = width*height;

var list = new Array(wxh);
var ab = new Uint16Array(wxh);
var num_iterations = 10;

// Variables to display average draw time.
var draw_total = 0;
var draw_number = 0;

// Get the canvas and context, turn off smoothing
var canvas = document.getElementById('image_canvas');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Create an ImageData object
var image_data = ctx.createImageData(canvas.width, canvas.height);

// Create a background canvas for offscreen rendering, and a context for it.
var background_canvas = document.createElement('canvas');
background_canvas.width = canvas.width;
background_canvas.height = canvas.height;
var background_ctx = background_canvas.getContext('2d');

// Get the colour scale range elements
var cs_min = document.getElementById('cs_min');
var cs_max = document.getElementById('cs_max');

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

function init() {
    console.log('Initialising list and ab');
    for (var i = 0; i < wxh; i++) {
        list[i] = i % 256;
        ab[i] = i % 65536;
    }
}

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
    ctx.scale(zoom_factor, zoom_factor);
    ctx.drawImage(background_canvas, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

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

function update_lower(value) {
    scale_min = parseInt(value);
    if (scale_min > scale_max) {
        scale_max = Math.min(cs_max.max, scale_min + 1);
        cs_max.value = scale_max;
    }
    draw_canvas();
}

function update_upper(value) {
    scale_max = parseInt(value);
    if (scale_max < scale_min) {
        scale_min = Math.max(cs_min.min, scale_max - 1);
        cs_min.value = scale_min
    }
    draw_canvas();
}

init();
