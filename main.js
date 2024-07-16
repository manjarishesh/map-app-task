window.onload = init;

function init() {
    const map = new ol.Map({
        view: new ol.View({
            center: [0, 0],
            zoom: 4
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'web-map'
    });

    const view = map.getView();
    let history = [view.calculateExtent(map.getSize())];
    let historyIndex = 0;
    let bookmarks = [];

    // Update history on view change
    map.on('moveend', function () {
        const newExtent = view.calculateExtent(map.getSize());
        history = history.slice(0, historyIndex + 1);
        history.push(newExtent);
        historyIndex++;
    });

    // Zoom In
    document.getElementById('zoom-in').onclick = function () {
        const zoom = view.getZoom();
        view.setZoom(zoom + 1);
    };

    // Zoom Out
    document.getElementById('zoom-out').onclick = function () {
        const zoom = view.getZoom();
        view.setZoom(zoom - 1);
    };

    // Zoom to Layer Extent
    document.getElementById('zoom-to-layer').onclick = function () {
        const layerExtent = map.getView().getProjection().getExtent();
        view.fit(layerExtent, { size: map.getSize() });
    };

    // Previous Extent
    document.getElementById('previous-extent').onclick = function () {
        if (historyIndex > 0) {
            historyIndex--;
            view.fit(history[historyIndex], { size: map.getSize() });
        }
    };

    // // Next Extent
    // document.getElementById('next-extent').onclick = function () {
    //     if (historyIndex < history.length - 1) {
    //         historyIndex++;
    //         view.fit(history[historyIndex], { size: map.getSize() });
    //     }
    // };

    // Add Bookmark
    document.getElementById('add-bookmark').onclick = function () {
        const currentExtent = view.calculateExtent(map.getSize());
        const bookmarkName = prompt("Enter a name for this bookmark:");
        if (bookmarkName) {
            bookmarks.push({ name: bookmarkName, extent: currentExtent });
            updateBookmarkList();
        }
    };

    // Navigate to Bookmark
    document.getElementById('bookmark-list').onchange = function () {
        const selectedIndex = this.selectedIndex - 1; // adjust for placeholder
        if (selectedIndex >= 0) {
            const selectedBookmark = bookmarks[selectedIndex];
            view.fit(selectedBookmark.extent, { size: map.getSize() });
        }
    };

    function updateBookmarkList() {
        const bookmarkList = document.getElementById('bookmark-list');
        bookmarkList.innerHTML = '<option value="">Select Bookmark</option>';
        bookmarks.forEach((bookmark, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = bookmark.name;
            bookmarkList.appendChild(option);
        });
    }
}
