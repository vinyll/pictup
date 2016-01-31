(function(module) {

  var imageContainer;

  function render(src) {
    var MAX_WIDTH = imageContainer.maxwidth || imageContainer.width;
    var MAX_HEIGHT = imageContainer.maxheight || imageContainer.height;
    var image = new Image();
    image.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = MAX_WIDTH;
      canvas.height = MAX_HEIGHT;
      document.body.appendChild(canvas);
      if (image.height > MAX_HEIGHT) {
        image.width *= MAX_HEIGHT / image.height;
        image.height = MAX_HEIGHT;
      }
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // canvas.width = image.width;
      // canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
    };
    image.src = src;
    return src;
  }

  function loadImage(src) {
    //	Prevent any non-image file type from being read.
    if (!src.type.match(/image.*/)) {
      console.error('The dropped file is not an image: ', src.type);
      return;
    }

    //	Create our FileReader and run the results through the render function.
    var reader = new FileReader();
    reader.onload = function(e) {
      var content = render(e.target.result);
      console.log('content', content);
    };

    reader.readAsDataURL(src);
    imageContainer.dispatchEvent(new CustomEvent('change', {detail: {
      file: src,
    }}));
  }

  var target = document.querySelector('[data-anypic]');
  target.addEventListener('dragover', function(e) {
    e.preventDefault();
  }, true);

  target.addEventListener('drop', function(e) {
    e.preventDefault();
    imageContainer = e.target;
    console.log(imageContainer)
    loadImage(e.dataTransfer.files[0]);
  }, true);

})(window);
