function getIp () {
  fetch('https://httpbin.org/ip')
    .then(res => res.json())
    .then(data => {
      window.location.href = '/?ip=' + data.origin
    })
}

function getGeoLocation () {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    window.location.href = '/?lat=' + latitude + '&lon=' + longitude
  })
}