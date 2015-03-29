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
