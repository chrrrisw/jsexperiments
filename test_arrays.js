var width = 10000;
var height = 1000;
var wxh = width*height;

var list = new Array(wxh);
var ab = new Uint16Array(wxh);
var num_iterations = 10;

if (typeof document !== 'undefined') {
    console.log("Running in browser");
} else {
    // Performance for nodejs
    console.log('Running in nodejs');
    function Performance() {};
    Performance.prototype = Object.create(Object.prototype);
    Performance.prototype.constructor = Performance;
    Performance.prototype.now = function() {
        var hr = process.hrtime();
        return (hr[0] + hr[1] / 1e9) * 1000;
    };
    var performance = new Performance();
    do_it_node();
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

    diff = (d2 - d1) / num_iterations;
    console.log('  Time:', diff);
    return diff;
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

function do_it_node() {
    init();

    write_list_for();
    write_list_while();
    read_list_for();
    read_list_while();
    // write_list_in();

    write_ab_for();
    write_ab_while();
    read_ab_for();
    read_ab_while();
    // write_ab_in();
}
