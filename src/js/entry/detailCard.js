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
    const _zoomButton = document.querySelector('.detail-slider__zoom-button');
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
  (function initFullScreen() {
    const _modalFullScreen = document.querySelector('.modal-full-screen');
    const _fullScreenButton = document.querySelector(
      '.detail-slider__full-screen'
    );
    const _modalFullScreenClose = document.querySelector(
      '.modal-full-screen__close'
    );
    _modalFullScreenClose.addEventListener('click', () => {
      _modalFullScreen.classList.remove('modal-full-screen_active');
      document.body.classList.remove('no-scroll');
    });

    _fullScreenButton.addEventListener('click', () => {
      const _selectedImg = document.querySelector(
        '.detail-slider__item.is-selected'
      );
      const src = _selectedImg.getAttribute('src');
      console.log(src);
      _modalFullScreen.classList.add('modal-full-screen_active');
      document.body.classList.add('no-scroll');
      _modalFullScreen.querySelector(
        '.modal-full-screen__content'
      ).style.backgroundImage = `url(${src})`;
    });
  })();
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
