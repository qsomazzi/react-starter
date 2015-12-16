var basePaths = {
    root: './',
    dest: './dist',
    src:  './src'
};

module.exports = {
    dest:  basePaths.dest,
    root:  basePaths.src,
    index: basePaths.src + '/index.html',
    styles: {
        src:   basePaths.src + '/styles/*.scss',
        dest:  basePaths.dest + '/css',
        index: 'main.css'
    },
    scripts: {
        src:   basePaths.src + '/scripts/app.jsx',
        dest : basePaths.dest + '/js',
        index: 'main.js'
    },
    plugins: {
        css: [
            basePaths.root + 'node_modules/bootstrap/dist/css/bootstrap.min.css',
            basePaths.root + 'node_modules/font-awesome/css/font-awesome.min.css'
        ],
        js: []
    },
    server: {
        enable: true,
        open:   true,
        port:   8000
    },
    copy: [
        basePaths.src + '/images/**/*.{jpg,png}',
        //basePaths.src + '/fonts/*.*'
    ],
    fonts: [
        basePaths.root + '/node_modules/font-awesome/fonts/*.*'
    ]
};