/**
 * srvoa - soa infrastructure for node js
 *
 * @copyright   Copyright (c) 2015, Alrik Zachert
 * @license     https://gitlab.com/kermit-js/kermit/blob/support/srvoa/LICENSE BSD-2-Clause
 */

var fs = require('fs'),
    exec = require('child_process').exec,
    v8Version = process.versions.v8.split('.'),
    // class support was shipped with v8 3.31.58
    requiredVersion = [3, 31, 58],
    packageFile = 'package-es5.js',
    packagePath = fs.realpathSync(__dirname + '/../');

if (v8Version[0] > requiredVersion[0] || (
    v8Version[0] == requiredVersion[0] && (
        v8Version[1] > requiredVersion[1] || (
            v8Version[1] == requiredVersion[1] && (
                v8Version[2] >= requiredVersion[2]
            )
        )
    )
)) {
    console.info('Your node installation supports es6 classes. Linking es6 version of srvoa.');
    packageFile = 'package-es6.js';
} else {
    console.info('Your node installation does not support es6 classes. Linking babel polyfill version of srvoa.');

    fs.stat(packagePath + '/build', function(err) {
        if (err) {
            console.info('There is no build of srvoa. Calling `npm run ' + packagePath + ' build`.');
            exec('npm run ' + packagePath + ' build', function(err, stdout, stderr) {
                if (stdout) {
                    console.info('[stdout]: ' + stdout);
                }
                if (stderr) {
                    console.err('[stderr]: ' + stderr);
                }

                if (err) {
                    throw new Error(err);
                }
            });
        }
    });
}

fs.unlink(packagePath + '/package.js', function(err) {
    if (err) {
        throw new Error(err);
    }

    fs.symlink(packagePath + '/' + packageFile, packagePath + '/package.js', function(err) {
        if (err) {
            throw new Error(err);
        }
    });
});
