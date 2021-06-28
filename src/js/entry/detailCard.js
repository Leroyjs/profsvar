import '~/sass/detail-card.scss';

const Flickity = require('flickity-fullscreen');

window.addEventListener('DOMContentLoaded', () => {
  let zoomEventListener = [];
  (function initDetailSlider() {
    const _detailSlider = document.querySelector('.detail-slider');
    const flktyLangingSlider = new Flickity(_detailSlider, {
      cellAlign: 'center',
      autoPlay: true
    });
    const _arrowRight = document.querySelector(
      '.detail-slider__full-screen-arrow_right'
    );
    const _arrowLeft = document.querySelector(
      '.detail-slider__full-screen-arrow_left'
    );
    const _zoomButton = document.querySelector('.detail-slider__zoom-button');
    setArrows(flktyLangingSlider, [_arrowLeft], [_arrowRight]);
    _arrowRight.addEventListener('click', () => {
      flktyLangingSlider.next();
      setArrows(flktyLangingSlider, [_arrowLeft], [_arrowRight]);
    });
    _arrowLeft.addEventListener('click', () => {
      flktyLangingSlider.previous();
      setArrows(flktyLangingSlider, [_arrowLeft], [_arrowRight]);
    });
    flktyLangingSlider.on('change', index => {
      setArrows(flktyLangingSlider, [_arrowLeft], [_arrowRight]);
    });
    _zoomButton.addEventListener('click', () => {
      const _slides = document.querySelectorAll('.detail-slider__item');
      if (_zoomButton.classList.contains('detail-slider__zoom-button_active')) {
        _slides.forEach((item, index) => {
          console.log(zoomEventListener);
          item.removeEventListener(
            'mousemove',
            zoomEventListener[index].mousemove
          );
          item.removeEventListener(
            'mouseout',
            zoomEventListener[index].mouseout
          );
        });
        zoomEventListener = [];
        _zoomButton.classList.remove('detail-slider__zoom-button_active');
      } else {
        _zoomButton.classList.add('detail-slider__zoom-button_active');
        _slides.forEach((item, index) => {
          zoomEventListener.push(initSlideZoom(item, index));
        });
      }
    });
    (function initFullScreen() {
      const _modalFullScreenWrapper = document.querySelector(
        '.detail-slider__wrapper'
      );
      const _fullScreenButton = document.querySelector(
        '.detail-slider__full-screen'
      );
      const _fullScreenClose = document.querySelector(
        '.detail-slider__full-screen-close'
      );
      const _body = document.body;
      _fullScreenClose.addEventListener('click', () => {
        _modalFullScreenWrapper.classList.remove('is-fullscreen');
        _body.classList.remove('no-scroll');
        flktyLangingSlider.resize();
      });
      _fullScreenButton.addEventListener('click', () => {
        _modalFullScreenWrapper.classList.add('is-fullscreen');
        _body.classList.add('no-scroll');
        flktyLangingSlider.resize();
      });
    })();
  })();
  function initSlideZoom(slide, index) {
    const width = slide.getBoundingClientRect().width;
    const height = slide.getBoundingClientRect().height;
    const mousemove = e => {
      slide.style.transform = `scale(2) translate(${
        -((e.layerX + index * width - width / 2) / width) * 50
      }%,${-((e.layerY - height / 2) / height) * 50}%)`;
    };
    const mouseout = () => {
      slide.style.transform = `scale(1)`;
    };
    slide.addEventListener('mousemove', mousemove);

    slide.addEventListener('mouseout', mouseout);
    return { mousemove, mouseout };
  }

  (function initBurger() {
    const _burger = document.querySelector('.burger');
    const _menu = document.querySelector('.burger-menu');

    _burger.addEventListener('click', () => {
      _menu.classList.toggle('burger-menu_active');
      _burger.classList.toggle('burger_active');
    });
  })();

  (function initModalContact() {
    const _buttons = document.querySelectorAll('.modal-contact__open-button');
    const _closeButton = document.querySelector('.modal-contact__close');
    const _modal = document.querySelector('.modal-contact');
    _buttons.forEach(item => {
      item.addEventListener('click', () => {
        _modal.classList.add('modal-contact_active');
      });
    });
    _closeButton.addEventListener('click', () => {
      _modal.classList.remove('modal-contact_active');
    });
  })();
});
function setArrows(flickity, arrowsLeft, arrowsRight) {
  if (flickity.selectedIndex === 0) {
    arrowsLeft.forEach(item => {
      item.classList.add('disabled-arrow');
    });
  } else {
    arrowsLeft.forEach(item => {
      item.classList.remove('disabled-arrow');
    });
  }

  if (flickity.selectedIndex === flickity.cells.length - 1) {
    arrowsRight.forEach(item => {
      item.classList.add('disabled-arrow');
    });
  } else {
    arrowsRight.forEach(item => {
      item.classList.remove('disabled-arrow');
    });
  }
}
