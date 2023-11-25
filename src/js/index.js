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

    if (page >= Math.ceil(queryTotalHints / 40)) {
      showMessage(
        'warning',
        'bottomCenter',
        "We're sorry,",
        `but you've reached the end of search results.`
      );
    }
  }
});

elements.popularBtn.addEventListener('click', handlerChangeOrder);

elements.latestBtn.addEventListener('click', handlerChangeOrder);

async function handlerChangeOrder(ev) {
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

  changeSelectedClassToBtn(currBtn.name);

  const newData = await pixabayApi.serviceImages(page, question, order);

  try {
    const { hits, totalHits } = newData;

    queryTotalHints = totalHits;

    elements.gallery.innerHTML = createMarkup(hits);

    simpleGallery.refresh();

    clearInterval(intervalId);

    runScrolling();

    setTimeout(() => (isObserverAlloved = true), 3000);
  } catch (err) {
    err => console.log(err);
  }
}

async function handlerLoadMore(ev) {
  if (page >= Math.ceil(queryTotalHints / 40) || !isObserverAlloved) {
    return;
  }

  page++;

  isObserverAlloved = false;

  const newData = await pixabayApi.serviceImages(page, question, order);

  try {
    const { hits, totalHits } = newData;

    queryTotalHints = totalHits;

    elements.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

    simpleGallery.refresh();

    clearInterval(intervalId);

    runScrolling();

    setTimeout(() => (isObserverAlloved = true), 3000);
  } catch (err) {
    err => console.log(err);
  }
}

elements.form.addEventListener('submit', handlerSubmit);

async function handlerSubmit(ev) {
  ev.preventDefault();

  const currentQuestion = ev.currentTarget.elements.searchQuery.value.trim();

  if (currentQuestion) {
    page = 1;

    isObserverAlloved = false;

    question = ev.currentTarget.elements.searchQuery.value;

    const newData = await pixabayApi.serviceImages(page, question, order);

    try {
      const { hits, totalHits } = newData;

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
    } catch (err) {
      err => console.log(err);
    }
  } else {
    ev.currentTarget.reset();
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
