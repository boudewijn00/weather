function getIp () {
  fetch('https://httpbin.org/ip')
    .then(res => res.json())
    .then(data => {
      window.location.href = '/?ip=' + data.origin
    })
}