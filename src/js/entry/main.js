import '~/sass/main';

import Flickity from 'flickity';
import Scrollbar from 'smooth-scrollbar';
import { Loader } from '@googlemaps/js-api-loader';

window.addEventListener('DOMContentLoaded', () => {
  (function initLangingSlider() {
    const _langingSlider = document.querySelector('.langing-slider');
    const flktyLangingSlider = new Flickity(_langingSlider, {
      // options
      cellAlign: 'left',
      contain: true,
      autoPlay: true
    });
  })();

  (function initCatalogSlider() {
    const _catalogSlider = document.querySelector('.catalog-slider__main');
    const _arrowRight = document.querySelector('.catalog-slider__arrow_right');
    const _arrowLeft = document.querySelector('.catalog-slider__arrow_left');
    const flktyCatalogSlider = new Flickity(_catalogSlider, {
      // options
      cellAlign: 'center',
      contain: true
    });
    _arrowRight.addEventListener('click', () => {
      flktyCatalogSlider.next();
    });
    _arrowLeft.addEventListener('click', () => {
      flktyCatalogSlider.previous();
    });
  })();

  (function initCaseSlider() {
    const _catalogSlider = document.querySelector('.case-gallery');
    const _arrowRight = document.querySelector('.case-gallery__arrow_right');
    const _arrowLeft = document.querySelector('.case-gallery__arrow_left');
    const flktyCaseSlider = new Flickity(_catalogSlider, {
      // options
      cellAlign: 'left'
      // contain: true,
    });
    _arrowRight.addEventListener('click', () => {
      flktyCaseSlider.next();
    });
    _arrowLeft.addEventListener('click', () => {
      flktyCaseSlider.previous();
    });

    function setCase(data, flkty) {
      const oldSlides = document.querySelectorAll('.case-gallery__slide');
      const _task = document.querySelector('#case-task');
      const _solution = document.querySelector('#case-solution');
      const _doc = document.querySelector('#case-doc');
      const newSlides = data.images.map(item => {
        const slide = document.createElement('img');
        slide.setAttribute('src', item);
        slide.classList.add('case-gallery__slide');
        return slide;
      });
      flkty.remove(oldSlides);
      flkty.append(newSlides);
      _task.innerHTML = data.task;
      _solution.innerHTML = data.solution;
      _doc.setAttribute('href', data.case);
    }

    (function initCaseTabs() {
      const _tabs = document.querySelector('.tabs');
      const _arrowRight = document.querySelector('.tabs__arrow_right');
      const _arrowLeft = document.querySelector('.tabs__arrow_left');
      initTabs(_tabs, _arrowRight, _arrowLeft, () =>
        setCase(fakeJSONForCases, flktyCaseSlider)
      );
    })();
  })();

  Scrollbar.init(document.querySelector('.city-list__scroll-box'), {
    alwaysShowTracks: true
  });

  function initTabs(_tabs, _arrowRight, _arrowLeft, handler) {
    const _tabsItems = _tabs.querySelectorAll('.tabs__link');

    const flktyTabs = new Flickity(_tabs, {
      // options
      cellAlign: 'center',
      contain: true
    });
    _arrowRight.addEventListener('click', () => {
      flktyTabs.next();
      handler && handler(_tabsItems[flktyTabs.selectedIndex].dataset.tabId);
    });
    _arrowLeft.addEventListener('click', () => {
      flktyTabs.previous();
      handler && handler(_tabsItems[flktyTabs.selectedIndex].dataset.tabId);
    });
    for (let i = 0; i < _tabsItems.length; i++) {
      _tabsItems[i].addEventListener('click', e => {
        e.preventDefault();
        flktyTabs.select(i);
        handler && handler(_tabsItems[i].dataset.tabId);
      });
    }
  }
  (function initMap() {
    const loader = new Loader({
      apiKey: 'AIzaSyCuoQDVtNGXCwgoZwdSfvYluQOPePW1xc8',
      version: 'weekly'
    });
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      });
    });
  })();

  (function initReviewsSlider() {
    (function initReviwesTabs() {
      const _tabs = document.querySelector('.reviews__tabs');
      const _arrowRight = document.querySelector('#reviews__arrow_right');
      const _arrowLeft = document.querySelector('#reviews__arrow_left');
      initTabs(_tabs, _arrowRight, _arrowLeft, setReview);
    })();
    function setReview(id) {
      const _reviews = document.querySelectorAll('.reviews__main');
      const _activeReview = document.getElementById('review-' + id);
      console.log(id);
      for (let item of _reviews) {
        console.log(item);
        item.classList.remove('reviews__main_active');
      }
      _activeReview.classList.add('reviews__main_active');
    }
  })();

  (function video() {
    const players = document.querySelectorAll('.player');

    players.forEach(item => {
      initVideo(item);
    });

    function initVideo(item) {
      const videoId = item.getAttribute('data-video-id');

      // 2. This code loads the IFrame Player API code asynchronously.

      item.style.backgroundImage = `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`;

      item.addEventListener('click', () => {
        let player;

        let firstScriptTag = document.getElementsByTagName('script')[0];
        let secScriptTag = document.getElementsByTagName('script')[1];

        const isYT =
          firstScriptTag.getAttribute('src') ===
            'https://www.youtube.com/iframe_api' ||
          secScriptTag.getAttribute('src') ===
            'https://www.youtube.com/iframe_api';

        if (!isYT) {
          console.log('ffff');
          let tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          createNewPlayer();
        } else {
          createNewPlayer();
        }

        // onYouTubeIframeAPIReady = function() {
        //   createNewPlayer();
        // };
        function createNewPlayer() {
          player = new YT.Player(item, {
            height: '100%',
            width: '100%',
            videoId,
            events: {
              onReady: onPlayerReady
            }
          });
        }
      });

      function onPlayerReady(event) {
        event.target.playVideo();
      }
    }
  })();
});

const fakeJSONForCases = {
  task: `При сварке угловых швов жидкий металл
        стремится стекать на нижнюю плоскость.
        Поэтому сварку таких швов в нижнем
        положении лучше производить «в лодочку»,
        а изделие располагать так, чтобы шлак
        не затекал на металл перед дугой

        Однако не всегда возможно установить
        деталь в нужное положение`,
  solution: `При сварке углового шва, нижняя плоскость которого расположена горизонтально,Поэтому сварку таких швов следует начинать, зажигая дугу на нижней плоскости в точке А, и вести электрод`,
  case: 'https://www.binance.com/ru/trade/BTC_USDT?layout=pro&type=spot',
  images: [
    'https://sun3-10.userapi.com/impf/c849524/v849524162/d9a53/UsQHGz3JPBI.jpg?size=1200x1200&quality=96&sign=82047f54ec3819a3dc3ccaef09e16d0c&type=album',
    '../media/case-slider/1.jpg',
    'https://sun3-10.userapi.com/impf/c849524/v849524162/d9a53/UsQHGz3JPBI.jpg?size=1200x1200&quality=96&sign=82047f54ec3819a3dc3ccaef09e16d0c&type=album',
    '../media/case-slider/1.jpg'
  ]
};
