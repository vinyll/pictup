(function(module) {
  'use strict';

  class Pictup {

    constructor(target, options) {
      this.target = target;
      let defaultOptions = {
        // Resize this image
        resize: true,
        // Max width and height for the result image
        maxwidth: 0,
        maxheight: 0,
        // Replace the current image src with the result
        replace: true,
      };
      this.options = Object.assign({}, defaultOptions, options);

      target.addEventListener('dragover', (e) => e.preventDefault(), true);

      target.addEventListener('drop', (e) => {
        e.preventDefault();
        this.loadImage(e.dataTransfer.files[0]);
      }, true);
    }

    loadImage(file) {
      //	Prevent any non-image file type from being read.
      if (!file.type.match(/image.*/)) {
        throw new Error(`The dropped file is not an image but a ${src.type}`);
      }

      let reader = new FileReader();
      reader.addEventListener('load', (e) => {
        var content = e.target.result;
        if (this.options.resize) {
          this.resize(content, this.options.maxwidth, this.options.maxheight);
        }
        else {
          this.ready(content);
        }
      });
      reader.readAsDataURL(file);
    }

    resize(content, maxwidth, maxheight) {
      if (!maxwidth) {
        let imageSrc = this.target;
        maxwidth = imageSrc.style.maxwidth || imageSrc.width;
        maxheight = imageSrc.style.maxheight || imageSrc.height;
      }
      var image = new Image();
      image.onload = () => {
        var canvas = document.createElement('canvas');
        if (image.height > maxheight) {
          image.width *= maxheight / image.height;
          image.height = maxheight;
        }
        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.width, image.height);

        this.ready(canvas.toDataURL());
      };
      image.src = content;
      return content;
    }

    ready(content) {
      if (this.options.replace) {
        this.target.src = content;
      }
      this.target.dispatchEvent(new CustomEvent('ready', { detail: content }));
    }
  }

  module.Pictup = Pictup;

})(window);
