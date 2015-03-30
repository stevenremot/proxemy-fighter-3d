export function setupHelp(startScreen, helpButton, keyboardScreen, touchScreen) {
    keyboardScreen.addEventListener('click', () => {
        keyboardScreen.style.display = 'none';
        startScreen.show();
    });

    touchScreen.addEventListener('click', () => {
        touchScreen.style.display = 'none';
        startScreen.show();
    });

    helpButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
    });

    helpButton.addEventListener('touchend', (event) => {
        startScreen.hide();
        touchScreen.style.display = 'block';
        event.stopPropagation();
    });

    helpButton.addEventListener('click', (event) => {
        startScreen.hide();
        keyboardScreen.style.display = 'block';
        event.stopPropagation();
    });
}
