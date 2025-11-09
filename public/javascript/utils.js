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

function redirectByLocation () {
  const location = document.getElementById('location').value
  window.location.href = '/?location=' + location
}

function initializeDayDetailsToggle () {
  const triggers = document.querySelectorAll('.day-details-trigger');

  // Initially hide content
  triggers.forEach(trigger => {
    trigger.nextElementSibling.classList.add('hidden');
  });

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('svg');
      content.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    });
  });
}
