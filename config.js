System.config({
  "baseURL": "/proxemy-fighter-3d/",
  "transpiler": "babel",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  },
  "bundles": {
    "build": [
      "src/world/object",
      "github:mrdoob/three.js@r70/build/three",
      "src/math/utils",
      "src/core/mixin",
      "src/collision/box",
      "src/world/explosion",
      "src/world/weapons/cannon",
      "src/world/weapons/pattern",
      "src/core/util",
      "src/core/fsm",
      "src/collision/sphere",
      "src/world/bullet/gatling",
      "src/render/camera",
      "src/world",
      "src/hud/lifebar",
      "src/hud/sights",
      "src/hud/score",
      "src/ai/detection",
      "src/ai/steerings",
      "src/input/keyboard",
      "src/input/touch/joystick",
      "src/fullscreen",
      "src/appcache",
      "src/help",
      "src/message-screen/base",
      "src/render/model-loader",
      "lib/OBJMTLLoader",
      "lib/OBJLoader",
      "lib/MTLLoader",
      "github:mrdoob/three.js@r70",
      "src/math/spherical-object",
      "src/world/bullet/straight",
      "src/world/life-container",
      "src/world/boss/turret/gatling",
      "src/render/context",
      "src/hud",
      "src/world/ai-vessel",
      "src/input/touch",
      "src/world/bullet/ship",
      "src/world/boss/module",
      "src/input/aggregate",
      "src/world/ship",
      "src/world/boss",
      "src/app",
      "src/main"
    ]
  }
});

System.config({
  "map": {
    "mrdoob/three.js": "github:mrdoob/three.js@r70"
  }
});
