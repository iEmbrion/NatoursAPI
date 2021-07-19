/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaWVtYnJpb24iLCJhIjoiY2tyM3FlazA2Mm56bTJ3bzZyMXpubjBpYyJ9.xZHWtU5HYSx7z4vavYWF_A';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/iembrion/ckr3qik64ew8q18mkemg7ymjb',
    scrollZoom: false,
    //
    //
    //
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    //Add marker
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
