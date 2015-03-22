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
