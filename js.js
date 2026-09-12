document.addEventListener('DOMContentLoaded', function () {
  var counters = document.querySelectorAll('.stat-number[data-target]');
  var duration = 1500;

  counters.forEach(function (counter) {
    var target = parseInt(counter.getAttribute('data-target'), 10);
    var finalDisplay = counter.getAttribute('data-display');
    if (isNaN(target)) return;

    var startTime = null;

    function animate(time) {
      if (startTime === null) {
        startTime = time;
      }

      var elapsed = time - startTime;
      var progress = elapsed / duration;
      if (progress > 1) {
        progress = 1;
      }

      var current = Math.floor(progress * target);
      counter.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        counter.textContent = finalDisplay ? finalDisplay : target;
      }
    }

    requestAnimationFrame(animate);
  });
});