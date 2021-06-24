import '~/sass/main';
import Scrollbar from 'smooth-scrollbar';
import { Loader } from '@googlemaps/js-api-loader';
import Inputmask from 'inputmask';
const Flickity = require('flickity-fullscreen');

window.addEventListener('DOMContentLoaded', () => {
  let isMobile = false;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile = true;
  }
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
  (function initPreloader() {
    let preloaderIsDone = false;
    let timeIsDone = false;
    const _preloader = document.querySelector('.preloader');
    _preloader.classList.toggle('preloader_tic');
    const preloaderAnimation = setInterval(() => {
      _preloader.classList.toggle('preloader_tic');
    }, 1200);
    setTimeout(() => {
      timeIsDone = true;
      if (window.pageLoaded) {
        preloaderDone();
      } else {
        window.addEventListener('load', () => {
          preloaderDone();
        });
      }
    }, 1000);
    setTimeout(() => {
      if (!preloaderIsDone) {
        preloaderDone();
      }
    }, 5000);
    function preloaderDone() {
      preloaderIsDone = true;
      const _body = document.body;
      _body.classList.add('loaded');
      _body.classList.remove('no-scroll');
      clearInterval(preloaderAnimation);
    }
  })();
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
    let countOfcatalogSliderItem = document
      .querySelector('.catalog-slider__main')
      .querySelectorAll('.catalog-slide').length;
    const _arrowRight = document.querySelectorAll(
      '.catalog-slider__arrow_right'
    );
    const _numbers = document.querySelector('.catalog-slider__numbers');
    const _arrowLeft = document.querySelectorAll('.catalog-slider__arrow_left');
    const flktyCatalogSlider = new Flickity(_catalogSlider, {
      // options
      cellAlign: 'center',
      contain: true
    });
    setArrows(flktyCatalogSlider, _arrowLeft, _arrowRight);
    chengeNumber(0);
    flktyCatalogSlider.on('change', index => {
      chengeNumber(index, false);
    });
    _arrowRight[0].addEventListener('click', () => {
      flktyCatalogSlider.next();
      setArrows(flktyCatalogSlider, _arrowLeft, _arrowRight);
    });
    _arrowLeft[0].addEventListener('click', () => {
      flktyCatalogSlider.previous();
      setArrows(flktyCatalogSlider, _arrowLeft, _arrowRight);
    });
    _arrowRight[1].addEventListener('click', () => {
      flktyCatalogSlider.next();
      setArrows(flktyCatalogSlider, _arrowLeft, _arrowRight);
    });
    _arrowLeft[1].addEventListener('click', () => {
      flktyCatalogSlider.previous();
      setArrows(flktyCatalogSlider, _arrowLeft, _arrowRight);
    });
    function chengeNumber(activeIndex, needInitFilter = true) {
      _numbers.innerHTML = '';
      for (let i = activeIndex - 2; i <= activeIndex + 2; i++) {
        const span = document.createElement('span');
        span.classList.add('catalog-slider__numbers-item');
        if (activeIndex === i) {
          span.classList.add('catalog-slider__numbers-item_active');
        }
        if (i >= 0 && i < countOfcatalogSliderItem) {
          span.addEventListener('click', () => {
            flktyCatalogSlider.select(i);
          });
          if (i < 10) {
            span.innerText = '0' + (i + 1);
          } else {
            span.innerText = i + 1;
          }
        }
        _numbers.append(span);
      }
      if (needInitFilter) {
        initFilter(flktyCatalogSlider, () => {
          setArrows(flktyCatalogSlider, _arrowLeft, _arrowRight);
          countOfcatalogSliderItem =
            document.querySelectorAll('.catalog-slide').length;
          chengeNumber(0, false);
        });
      }
    }

    function initFilter(flickity, handler) {
      console.log('ddd');
      const _radioButtons = document.querySelectorAll('.filters__hidden-input');
      const _catalogItems = document.querySelectorAll('.catalog-slide');
      const stateFilters = {
        movement: false,
        mechanism: false
      };

      _radioButtons.forEach(item => {
        item.addEventListener('click', e => {
          e.preventDefault();
          if (stateFilters[item.name] === item.value) {
            stateFilters[item.name] = false;
          } else {
            stateFilters[item.name] = item.value;
          }
          updateCatalog(stateFilters, _catalogItems);
          updateFilters(stateFilters, _radioButtons);
        });
      });
      function updateFilters(newState, items) {
        items.forEach(item => {
          if (item.getAttribute('name') === 'movement') {
            if (item.getAttribute('value') == newState.movement) {
              item.classList.add('filters__hidden-input_active');
            } else {
              item.classList.remove('filters__hidden-input_active');
            }
          }
          if (item.getAttribute('name') === 'mechanism') {
            if (item.getAttribute('value') == newState.mechanism) {
              item.classList.add('filters__hidden-input_active');
            } else {
              item.classList.remove('filters__hidden-input_active');
            }
          }
        });
      }
      function updateCatalog(newState, items) {
        items.forEach((item, index) => {
          if (
            (item.dataset.mechanism === newState.mechanism ||
              !newState.mechanism) &&
            (item.dataset.movement === newState.movement || !newState.movement)
          ) {
            if (item.style.display !== 'block') {
              item.style.display = 'block';
              flickity.append(item);
            }
          } else {
            if (item.style.display !== 'none') {
              item.style.display = 'none';
              flickity.remove(item);
            }
          }
        });

        // flickity.resize();
        flickity.select(0);
        flickity.reloadCells();
        handler();
      }
    }
  })();
  let zoomEventListener = [];
  (function initCaseSlider() {
    const _catalogSlider = document.querySelector('.case-gallery');
    const _arrowRight = document.querySelector('.case-gallery__arrow_right');
    const _arrowLeft = document.querySelector('.case-gallery__arrow_left');

    const _zoomButton = document.querySelector('.case-gallery__zoom-button');
    const flktyCaseSlider = new Flickity(_catalogSlider, {
      lazyLoad: 2,
      groupCells: 1,
      imagesLoaded: true
    });
    setTimeout(() => {
      flktyCaseSlider.resize();
    }, 2000);
    setArrows(flktyCaseSlider, [_arrowLeft], [_arrowRight]);
    _arrowRight.addEventListener('click', () => {
      flktyCaseSlider.next();
      setArrows(flktyCaseSlider, [_arrowLeft], [_arrowRight]);
    });
    _arrowLeft.addEventListener('click', () => {
      flktyCaseSlider.previous();
      setArrows(flktyCaseSlider, [_arrowLeft], [_arrowRight]);
    });

    _zoomButton.addEventListener('click', () => {
      const _slides = document.querySelectorAll('.case-gallery__slide');
      if (_zoomButton.classList.contains('case-gallery__zoom-button_active')) {
        _slides.forEach((item, index) => {
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
        _zoomButton.classList.remove('case-gallery__zoom-button_active');
      } else {
        _zoomButton.classList.add('case-gallery__zoom-button_active');
        _slides.forEach((item, index) => {
          zoomEventListener.push(initSlideZoom(item, index));
        });
      }
    });
    (function initFullScreen() {
      const _modalFullScreen = document.querySelector('.modal-full-screen');
      const _fullScreenButton = document.querySelector(
        '.case-gallery__full-screen'
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
          '.case-gallery__slide.is-selected img'
        );
        const src = _selectedImg.getAttribute('src');
        _modalFullScreen.classList.add('modal-full-screen_active');
        document.body.classList.add('no-scroll');
        _modalFullScreen.querySelector(
          '.modal-full-screen__content'
        ).style.backgroundImage = `url(${src})`;
      });
    })();
    function setCase(data, flkty) {
      const oldSlides = document.querySelectorAll('.case-gallery__slide');
      const _task = document.querySelector('#case-task');
      const _solution = document.querySelector('#case-solution');
      const _doc = document.querySelector('#case-doc');
      const _zoomButton = document.querySelector('.case-gallery__zoom-button');
      const newSlides = data.images.map(item => {
        const img = document.createElement('img');
        img.setAttribute('src', item);
        const slide = document.createElement('div');
        slide.classList.add('case-gallery__slide');
        slide.append(img);

        return slide;
      });
      zoomEventListener = [];
      _zoomButton.classList.remove('case-gallery__zoom-button_active');
      flkty.remove(oldSlides);
      flkty.append(newSlides);
      flkty.select(0);
      _task.innerHTML = data.task;
      _solution.innerHTML = data.solution;
      _doc.setAttribute('href', data.case);
    }

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

    (function initCaseTabs() {
      const _tabs = document.querySelector('.tabs');
      const _arrowRight = document.querySelectorAll(
        '.cases .tabs__arrow_right'
      );
      const _arrowLeft = document.querySelectorAll('.cases .tabs__arrow_left');
      const _numbers = document.querySelector('.cases .tabs__numbers');
      initTabs(_tabs, _arrowRight, _arrowLeft, _numbers, () =>
        setCase(fakeJSONForCases, flktyCaseSlider)
      );
    })();
  })();

  Scrollbar.init(document.querySelector('.city-list__scroll-box'), {
    alwaysShowTracks: true
  });

  function initTabs(_tabs, _arrowRight, _arrowLeft, _numbers, handler) {
    const _tabsItems = _tabs.querySelectorAll('.tabs__link');
    const flktyTabs = new Flickity(_tabs, {
      // options
      cellAlign: 'center',
      contain: true
    });
    chengeNumber(0);
    flktyTabs.on('change', index => {
      chengeNumber(index);
      handler && handler(_tabsItems[flktyTabs.selectedIndex].dataset.tabId);
    });
    function chengeNumber(activeIndex) {
      _numbers.innerHTML = '';
      for (let i = activeIndex - 2; i <= activeIndex + 2; i++) {
        const span = document.createElement('span');
        span.classList.add('tabs__numbers-item');
        if (activeIndex === i) {
          span.classList.add('tabs__numbers-item_active');
        }
        if (i >= 0 && i < _tabs.querySelectorAll('.tabs__li').length) {
          span.addEventListener('click', () => {
            flktyTabs.select(i);
          });
          if (i < 10) {
            span.innerText = '0' + (i + 1);
          } else {
            span.innerText = i + 1;
          }
        }
        _numbers.append(span);
      }
    }
    setArrows(flktyTabs, _arrowLeft, _arrowRight);
    _arrowRight[0].addEventListener('click', () => {
      flktyTabs.next();
      setArrows(flktyTabs, _arrowLeft, _arrowRight);
      handler && handler(_tabsItems[flktyTabs.selectedIndex].dataset.tabId);
    });
    _arrowLeft[0].addEventListener('click', () => {
      flktyTabs.previous();
      setArrows(flktyTabs, _arrowLeft, _arrowRight);
      handler && handler(_tabsItems[flktyTabs.selectedIndex].dataset.tabId);
    });
    _arrowRight[1].addEventListener('click', () => {
      flktyTabs.next();
      setArrows(flktyTabs, _arrowLeft, _arrowRight);
      handler && handler(_tabsItems[flktyTabs.selectedIndex].dataset.tabId);
    });
    _arrowLeft[1].addEventListener('click', () => {
      flktyTabs.previous();
      setArrows(flktyTabs, _arrowLeft, _arrowRight);
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
    const mapStyles = [
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#212121'
          }
        ]
      },
      {
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575'
          }
        ]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#212121'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            color: '#757575'
          }
        ]
      },
      {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#9e9e9e'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#bdbdbd'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#181818'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1b1b1b'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2c2c2c'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8a8a8a'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#373737'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#3c3c3c'
          }
        ]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          {
            color: '#4e4e4e'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#3d3d3d'
          }
        ]
      }
    ];
    const loader = new Loader({
      apiKey: 'AIzaSyCuoQDVtNGXCwgoZwdSfvYluQOPePW1xc8',
      version: 'weekly'
    });
    loader.load().then(() => {
      const citylistData = [];
      const _citylist = document.querySelectorAll('.city-list__item');
      const _mapClose = document.querySelector('.map__close');
      const _mapInfo = document.querySelector('.map__info');
      const _cityListButton = document.getElementById('city-list__button');
      _mapClose.addEventListener('click', () => {
        _mapInfo.classList.remove('map__info_active');
        document.body.classList.remove('no-scroll');
      });
      _cityListButton.addEventListener('click', () => {
        _mapInfo.classList.add('map__info_active');
        document.body.classList.add('no-scroll');
      });
      for (let item of _citylist) {
        let city = {
          lat: +item.dataset.lat,
          lng: +item.dataset.lan,
          count: +item.querySelectorAll('div')[1].innerHTML,
          title: item.querySelectorAll('div')[0].innerHTML
        };
        citylistData.push(city);
      }

      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: citylistData[0].lat, lng: citylistData[0].lng },
        zoom: 8,
        styles: mapStyles,
        mapTypeControl: false,
        streetViewControl: false
      });

      function HTMLMarker(lat, lng, count, title) {
        this.lat = lat;
        this.lng = lng;
        this.count = count;
        this.title = title;
        this.pos = new google.maps.LatLng(lat, lng);
      }
      HTMLMarker.prototype = new google.maps.OverlayView();
      HTMLMarker.prototype.onRemove = function () {};
      HTMLMarker.prototype.draw = function () {
        var overlayProjection = this.getProjection();
        var position = overlayProjection.fromLatLngToDivPixel(this.pos);
        var panes = this.getPanes();
        this.el.style.left = position.x + 'px';
        this.el.style.top = position.y - 30 + 'px';
      };
      HTMLMarker.prototype.onAdd = function () {
        const div = document.createElement('DIV');
        const title = document.createElement('DIV');
        title.innerText = this.title;
        div.className = 'map__marker';
        title.className = 'map__marker-title';
        div.innerHTML = this.count;
        div.append(title);
        div.addEventListener('click', () => {
          div.classList.toggle('map__marker_active');
        });
        var panes = this.getPanes();
        this.el = div;
        panes.overlayImage.appendChild(div);
      };

      citylistData.forEach((item, index) => {
        const htmlMarker = new HTMLMarker(
          item.lat,
          item.lng,
          item.count,
          item.title
        );
        htmlMarker.setMap(map);
        _citylist[index].addEventListener('click', () => {
          document.body.classList.remove('no-scroll');
          _mapInfo.classList.remove('map__info_active');
          map.panTo(new google.maps.LatLng(item.lat, item.lng));
        });
      });
    });
  })();

  (function initReviewsSlider() {
    (function initReviwesTabs() {
      const _tabs = document.querySelector('.reviews__tabs');
      const _arrowRight = document.querySelectorAll(
        '.reviews .tabs__arrow_right'
      );
      const _arrowLeft = document.querySelectorAll(
        '.reviews .tabs__arrow_left'
      );
      const _numbers = document.querySelector('.reviews .tabs__numbers');
      initTabs(_tabs, _arrowRight, _arrowLeft, _numbers, setReview);
    })();
    function setReview(id) {
      const _reviews = document.querySelectorAll('.reviews__main');
      const _activeReview = document.getElementById('review-' + id);
      for (let item of _reviews) {
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
  (function initAncors() {
    const anchors = document.querySelectorAll('a[href*="#"]');

    for (let anchor of anchors) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const blockID = anchor.getAttribute('href').substr(1);

        document.getElementById(blockID).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  })();
  (function initBurger() {
    const _burger = document.querySelector('.burger');
    const _menu = document.querySelector('.burger-menu');
    const _menuAncors = _menu.querySelectorAll('a');

    _menuAncors.forEach(item => {
      item.addEventListener('click', () => {
        _menu.classList.remove('burger-menu_active');
        document.body.classList.remove('no-scroll');
        _burger.classList.remove('burger_active');
      });
    });

    _burger.addEventListener('click', () => {
      _menu.classList.toggle('burger-menu_active');
      _burger.classList.toggle('burger_active');
      document.body.classList.toggle('no-scroll');
    });
  })();

  (function initModalContact() {
    const _buttons = document.querySelectorAll('.modal-contact__open-button');
    const _closeButton = document.querySelector('.modal-contact__close');
    const _modal = document.querySelector('.modal-contact');
    _buttons.forEach(item => {
      item.addEventListener('click', () => {
        _modal.classList.add('modal-contact_active');
        document.body.classList.add('no-scroll');
      });
    });
    _closeButton.addEventListener('click', () => {
      _modal.classList.remove('modal-contact_active');
      document.body.classList.remove('no-scroll');
    });
  })();
  (function initModalSocial() {
    const _buttons = document.querySelectorAll('.modal-social__open-button');
    const _closeButton = document.querySelector('.modal-social__close');
    const _modal = document.querySelector('.modal-social');
    _buttons.forEach(item => {
      item.addEventListener('click', () => {
        _modal.classList.add('modal-social_active');
        document.body.classList.add('no-scroll');
      });
    });
    _closeButton.addEventListener('click', () => {
      _modal.classList.remove('modal-social_active');
      document.body.classList.remove('no-scroll');
    });
  })();
  (function initMobileResize() {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--fsvh', `${vh}px`);
  })();
  if (!isMobile) {
    initParallax();
  }
  function initParallax() {
    let windowHeight = document.documentElement.clientHeight;

    window.addEventListener('resize', () => {
      windowHeight = document.documentElement.clientHeight;
    });

    const _parallaxBlocks = document.querySelectorAll('.parallax');
    const _overlay = document.querySelectorAll('.langing-slider__overlay');
    window.addEventListener('scroll', () => {
      _parallaxBlocks.forEach((item, index) => {
        item.style.transform = `translateY(${window.pageYOffset}px) scale(${
          window.pageYOffset / windowHeight / 2 + 1
        })`;
        _overlay[index].style.opacity =
          0.2 + window.pageYOffset / windowHeight / 1.5;
      });
    });
  }
  (function initForm() {
    const _numberInput = document.querySelector(
      '.modal-contact__input_type_number'
    );
    const _nameInput = document.querySelector(
      '.modal-contact__input_type_name'
    );
    const _mailInput = document.querySelector(
      '.modal-contact__input_type_mail'
    );
    const _commentInput = document.querySelector(
      '.modal-contact__input_type_comment'
    );
    const _form = document.querySelector('.modal-contact__form');

    const errors = {
      number: false,
      name: false,
      mail: false
    };
    _form.addEventListener('submit', e => {
      e.preventDefault();
      checkErrors();
      setErrors();
      if (!errors.name && (!errors.mail || !errors.number)) console.log('send');
    });
    const im = new Inputmask({
      mask: '+7(999)999-9999',
      showMaskOnHover: false
    });
    im.mask(_numberInput);

    function setErrors() {
      for (const error in errors) {
        const _errorNode = document.querySelector(
          `.modal-contact__error_type_${error}`
        );
        if (errors[error]) {
          _errorNode.innerHTML = errors[error];
          _errorNode.classList.add('modal-contact__error_active');
        } else {
          _errorNode.innerHTML = '';
          _errorNode.classList.remove('modal-contact__error_active');
        }
      }
    }

    function checkErrors() {
      if (_numberInput.value) {
        if (_numberInput.value.split('_').length === 1) {
          errors.number = false;
        } else {
          errors.number = 'Некорректный номер';
        }
      } else {
        errors.number = 'Поле обязательно для заполнения';
      }
      if (_nameInput.value) {
        errors.name = false;
      } else {
        errors.name = 'Поле обязательно для заполнения';
      }
      if (_mailInput.value) {
        const validate = _mailInput.value.match(
          /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
        );
        if (validate) {
          errors.mail = false;
        } else {
          errors.mail = 'Некорректная почта';
        }
      } else {
        errors.mail = 'Поле обязательно для заполнения';
      }
    }
  })();

  (function chooseInfo() {
    const _chooseInfoButton = document.querySelector('.filters__choose-info');
    const _modalChooseInfo = document.querySelector('.modal-choose-info');
    // const _body = document.body;
    const _chooseInfoCancel = document.querySelector(
      '.modal-choose-info__cancel'
    );
    _chooseInfoButton.addEventListener('click', () => {
      // openModal();
      _modalChooseInfo.classList.toggle('modal-choose-info_active');
      // _body.addEventListener('mousedown', closeModal);
    });
    _chooseInfoCancel.addEventListener('click', () => {
      closeModal();
    });
    function closeModal(e) {
      console.log(e);
      _modalChooseInfo.classList.remove('modal-choose-info_active');
      // _body.removeEventListener('mousedown', closeModal);
    }
    function openModal() {
      _modalChooseInfo.classList.add('modal-choose-info_active');
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
