async function initMap(containerId, mapStyleUrl) {
  return new Promise((resolve, reject) => {
    const map = new maplibregl.Map({
      style: mapStyleUrl,
      center: [12.318427099380749, 51.323676093687546],
      zoom: 7,
      container: containerId,
    });
    map.on("load", () => {
      addImages(map);
      addEvents(map);
      resolve(map);
    });
  });
}


async function displaySpacesLayer(spaces, map) {
  const spaceFeatures = [];
  const bounds = new maplibregl.LngLatBounds();

  spaces.forEach((space, idx) => {
    if (
      !space.data ||
      !space.data.ext_habitat ||
      space.data.ext_habitat.toLowerCase() != "chaoszone"
    ) {
      return;
    }

    const open = space.data.state && space.data.state.open;

    spaceFeatures.push({
      type: "Feature",
      properties: {
        space: space.data,
        icon: "custom-marker" + (open ? "-green" : ""),
      },
      geometry: {
        type: "Point",
        coordinates: [space.data.location.lon, space.data.location.lat],
      },
    });

    bounds.extend(
      new maplibregl.LngLat(space.data.location.lon, space.data.location.lat)
    );
  });

  map.addSource("points", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: spaceFeatures,
    },
  });

  // Add a symbol layer
  map.addLayer({
    id: "symbols",
    type: "symbol",
    source: "points",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": "{icon}",
      "icon-size": 0.4,
      "icon-allow-overlap": true,
    },
  });

  map.fitBounds(bounds, { padding: 100, animate: false });

  map.getCanvas().style.cursor = "default";

  map.scrollZoom.disable();
}


async function addImages(map) {
  map
    .loadImage("./img/marker_small_white.png?l=1")
    .then((image) => map.addImage("custom-marker", image.data));
  map
    .loadImage("./img/marker_small_green.png?l=1")
    .then((image) => map.addImage("custom-marker-green", image.data));
}


function addEvents(map) {
  map.on("mouseenter", "symbols", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "symbols", () => {
    map.getCanvas().style.cursor = "default";
  });

   map.on("click", "symbols", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const space = JSON.parse(e.features[0].properties.space);
    console.log(e.features[0]);

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const open = space.state && space.state.open;

    let stateHtml = space.state
      ? `<div>${open ? "geöffnet" : "gerade geschlossen"}</div>`
      : "";

    let html = `<div>
              <div><strong>${space.space}</strong></div>
              ${stateHtml}
              <div><a href="${space.url}" target='_blank'>${space.url}</a></div>
            </div>`;

    new maplibregl.Popup().setLngLat(coordinates).setHTML(html).addTo(map);
  });
}

class ChaosMap extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://map.chaoszone.cz/proxy/maplibre-gl/dist/maplibre-gl.css">
            <script src="https://map.chaoszone.cz/proxy/maplibre-gl/dist/maplibre-gl.js"></script>
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: max(400px, 50vh);
                    margin: 0;
                }

                #map {
                    width: 100%;
                    height: 100%;
                }
            </style>
            <div id="map"></div>
        `;

        const waitForMaplibre = () => {
            if (window.maplibregl) {
                this.initMap();
            } else {
                setTimeout(waitForMaplibre, 100);
            }
        };  

        waitForMaplibre();
         
    }

    async initMap() {
        const map = await initMap(this.shadowRoot.getElementById('map'), './js/mapstyle.json');

        // Fetch spaces data from the API
        const response = await fetch('https://map.chaoszone.cz/spaceapi');
        const data = await response.json();

        await displaySpacesLayer(data, map);
    }
}

const script = document.createElement('script');
script.src = 'https://map.chaoszone.cz/proxy/maplibre-gl/dist/maplibre-gl.js';
document.body.appendChild(script);

customElements.define('chaos-map', ChaosMap);
