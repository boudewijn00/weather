function getIpAndRedirect () {
  fetch('https://httpbin.org/ip')
    .then(res => res.json())
    .then(data => {
      window.location.href = '/?ip=' + data.origin
    })
}

function getCoordsAndRedirect () {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords)
    const { latitude, longitude } = position.coords
    window.location.href = '/?lat=' + latitude + '&lon=' + longitude
  })
}