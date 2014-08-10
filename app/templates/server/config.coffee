# Config
defaults = require '../config/defaults'

for key, value of defaults
  process.env[key] ?= value