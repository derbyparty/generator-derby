## Derby 0.6 generator [![Build Status](https://travis-ci.org/derbyparty/generator-derby.svg?branch=master)](https://travis-ci.org/derbyparty/generator-derby)

[Yeoman](http://yeoman.io) generator that scaffolds out a [Derby](http://derbyjs.com) 0.6 app.

### Features

* Derby 0.6
* Express 4
* Pure JavaScript/CoffeeScript
* optional Jade
* optional Stylus
* optional Redis
* optional Bootstrap 3
* optional [derby-login](https://github.com/derbyparty/derby-login)
* optional [racer-schema](https://github.com/derbyparty/racer-schema)
* optional [bower](http://bower.io/) settings files

### Getting Started

- Install: `npm install -g yo`
- Install: `npm install -g generator-derby`
- Make app dir: `mkdir myapp`
- Go into the dir: `cd myapp`
- Run: `yo derby` or `yo derby --coffee`

### Generators

#### `yo derby`
Create a new Derby app.

#### `yo derby:component "Humanish Name"`
Creates a [Derby component][].

Run inside of an app (created with `yo derby`), the new component will
be put into `/components/<component-name>`.

Run in an empty directory, the new component will be a new package, ready for
publishing to NPM, with the `d-` prefix.

The package and class name will be derived from the humanish name.

### Options

* `--skip-install`

  Skips the automatic execution of `npm` after scaffolding has finished.

* `--coffee`

  Add support for [CoffeeScript](http://coffeescript.org/).
  
## MIT License
Copyright (c) 2014 by Artur Zayats

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[Derby component]: https://github.com/codeparty/derby/blob/master/docs/guides/components.md
