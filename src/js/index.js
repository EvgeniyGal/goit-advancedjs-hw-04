import * as pixabayApi from './pixabayApi';
import 'normalize.css/normalize.css';
import iziToast from 'izitoast';
import '../css/iziToast.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page;
let question;
let queryTotalHints;
let order = 'popular';
const simpleGallery = new SimpleLightbox('.gallery a');
let isObserverAlloved = false;
let intervalId;

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  popularBtn: document.querySelector('[name="popular"]'),
  latestBtn: document.querySelector('[name="latest"]'),
  target: document.querySelector('.target'),
};

let observerOptions = {
  rootMargin: '200px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(handlerLoadMore, observerOptions);
observer.observe(elements.target);

addEventListener('wheel', () => clearInterval(intervalId));

addEventListener('click', () => clearInterval(intervalId));

addEventListener('scrollend', () => {
  if (window.scrollY + window.innerHeight + 1 > document.body.scrollHeight) {
    clearInterval(intervalId);
  }
});

elements.popularBtn.addEventListener('click', handlerChangeOrder);

elements.latestBtn.addEventListener('click', handlerChangeOrder);

function handlerChangeOrder(ev) {
  const currBtn = ev.target;

  if (currBtn.name === order) {
    return;
  }

  if (!question) {
    order = currBtn.name;
    changeSelectedClassToBtn(currBtn.name);
    return;
  }

  page = 1;

  order = currBtn.name;

  isObserverAlloved = false;

  pixabayApi
    .serviceImages(page, question, order)
    .then(({ hits, totalHits }) => {
      queryTotalHints = totalHits;

      elements.gallery.innerHTML = createMarkup(hits);

      simpleGallery.refresh();

      clearInterval(intervalId);

      runScrolling();

      setTimeout(() => (isObserverAlloved = true), 3000);
    })
    .catch(err => console.log(err));

  changeSelectedClassToBtn(currBtn.name);
}

function handlerLoadMore(ev) {
  if (page > Math.ceil(queryTotalHints / 40) || !isObserverAlloved) {
    return;
  }

  page++;

  pixabayApi
    .serviceImages(page, question, order)
    .then(({ hits, totalHits }) => {
      queryTotalHints = totalHits;

      elements.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

      simpleGallery.refresh();

      clearInterval(intervalId);

      runScrolling();

      if (page === Math.ceil(totalHits / 40)) {
        showMessage(
          'warning',
          'bottomCenter',
          "We're sorry,",
          `but you've reached the end of search results.`
        );
      }
    })
    .catch(err => console.log(err));
}

elements.form.addEventListener('submit', handlerSubmit);

function handlerSubmit(ev) {
  ev.preventDefault();

  if (ev.currentTarget.elements.searchQuery.value) {
    page = 1;

    isObserverAlloved = false;

    question = ev.currentTarget.elements.searchQuery.value;

    pixabayApi
      .serviceImages(page, question, order)
      .then(({ hits, totalHits } = {}) => {
        if (totalHits > 0) {
          queryTotalHints = totalHits;

          elements.gallery.innerHTML = createMarkup(hits);

          simpleGallery.refresh();

          showMessage(
            'success',
            'topLeft',
            'Hooray!',
            `We found ${totalHits} images.`
          );

          setTimeout(() => (isObserverAlloved = true), 3000);

          clearInterval(intervalId);

          runScrolling();
        } else {
          showMessage(
            'warning',
            'center',
            'Sorry,',
            `there are no images matching your search query. Please try again.`
          );

          elements.gallery.innerHTML = '';
        }
      })
      .catch(err => console.log(err.message));
  }
}

function createMarkup(photoArr) {
  return photoArr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        comments,
        downloads,
        views,
        likes,
      }) => `
        <div class="photo-card">
         <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" />
            <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div></a>
          </div>
    `
    )
    .join('');
}

function changeSelectedClassToBtn(name) {
  elements.latestBtn.classList.toggle('active-btn', name === 'latest');
  elements.popularBtn.classList.toggle('active-btn', name === 'popular');
}

function showMessage(type, position, title, message) {
  iziToast[type]({
    position,
    title,
    message,
  });
}

function runScrolling() {
  let position = window.scrollY;
  intervalId = setInterval(() => {
    window.scroll(0, position);
    position += 1;
  }, 20);
}
