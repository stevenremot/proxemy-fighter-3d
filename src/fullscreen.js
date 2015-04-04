/**
 * Copyright (C) 2015 Alexandre Kazmierowski, Steven Rémot
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function isFullscreenEnabled() {
    return !!(document.fullscreenElement ||
              document.mozFullscreenElement ||
              document.webkitFullscreenElement ||
              document.msFullscreenElement);
}

export function addFullscreenToElement(element) {
    element.addEventListener('click', () => {
        if (!isFullscreenEnabled()) {
            launchIntoFullscreen(document.documentElement);
        } else {
            exitFullscreen();
        }
    });
}
