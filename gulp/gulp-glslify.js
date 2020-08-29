const path = require('path');
const glsl = require('glslify');
const through = require('through2');
 
module.exports = (options = {}) => {
    return through.obj(function(file, encoding, callback) {
        if (file.isDirectory() || file.isNull() || file.isStream()) {
            return callback(null, file);
        }

        var content = String(file.contents);
        options.basedir = options.basedir || path.dirname(file.path);
        content = glsl(content, options);
        const pieces = file.path.split('\\');
        const name = pieces[pieces.length-1].split('.')[0];
        content =`window.${name} = ${JSON.stringify(content)};`;

        file.contents = Buffer.from(content);
        file.path += '.js';

        this.push(file);
        callback();
    });
};