/**
 * Copyright (C) 2015 The Proxemy Fighter 3D Team
 * Licensed under the General Public License, see the file gpl.txt at the root for details.
 */

export function setupAppcache(applicationCache, dialogNode) {

    function toggleUpdateWindow() {
        dialogNode.classList.toggle('shown');
    }

    dialogNode.querySelector('ul li:last-child a').addEventListener(
        'click',
        (event) => {
            toggleUpdateWindow();
            event.preventDefault();
            event.stopPropagation();
        }
    );

    applicationCache.addEventListener('updateready', toggleUpdateWindow);

    if (applicationCache.status === applicationCache.UPDATEREADY) {
        toggleUpdateWindow();
    }
}
