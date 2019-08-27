if('serviceWorker' in navigator){
    // window.addEventListener('load', function(){
        navigator.serviceWorker.register('/sw.js') 
        .then(( reg) => console.log('Service worker registered', reg))
        .catch((err) => console.log(' service worker not registered', err))
    // })
}

if (!('Notification' in window)) {
    console.log('This browser does not support notifications!');
    return;
  }