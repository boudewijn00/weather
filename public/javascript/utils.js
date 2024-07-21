function getIpAndRedirect () {
  fetch('https://httpbin.org/ip')
    .then(res => res.json())
    .then(data => {
      window.location.href = '/?ip=' + data.origin
    })
}

function getCoordsAndRedirect () {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    window.location.href = '/?lat=' + latitude + '&lon=' + longitude
  })
}

function redirectByCityName () {
  const city = document.getElementById('city').value
  window.location.href = '/?city=' + city
}