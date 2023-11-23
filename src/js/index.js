import * as pixabayApi from './pixabayApi';
import 'normalize.css/normalize.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/izitoast.css';

let page = 1;
let question;
let queryTotalHints;
let order = 'popular';

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  popularBtn: document.querySelector('[name="popular"]'),
  latestBtn: document.querySelector('[name="latest"]'),
  loadMoreBtn: document.querySelector('.load-more'),
};

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
  pixabayApi
    .serviceImages(page, question, order)
    .then(({ hits, totalHits }) => {
      queryTotalHints = totalHits;
      elements.gallery.innerHTML = createMarkup(hits);
    })
    .catch(err => console.log(err));
  changeSelectedClassToBtn(currBtn.name);
}

function changeSelectedClassToBtn(name) {
  elements.latestBtn.classList.toggle('active-btn', name === 'latest');
  elements.popularBtn.classList.toggle('active-btn', name === 'popular');
}

elements.loadMoreBtn.addEventListener('click', hamdlerLoadMore);

function hamdlerLoadMore(ev) {
  page++;
  pixabayApi
    .serviceImages(page, question, order)
    .then(({ hits, totalHits }) => {
      queryTotalHints = totalHits;
      elements.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));

      if (page >= Math.ceil(totalHits / 40)) {
        ev.target.classList.toggle('hiden-element', true);
        iziToast.warning({
          position: 'bottomCenter',
          title: "We're sorry,",
          message: "but you've reached the end of search results.",
        });
      }
    })
    .catch(err => console.log(err));
}

elements.form.addEventListener('submit', handlerSubmit);

function handlerSubmit(ev) {
  ev.preventDefault();

  if (ev.currentTarget.elements.searchQuery.value) {
    question = ev.currentTarget.elements.searchQuery.value;

    elements.loadMoreBtn.classList.toggle('hiden-element', true);

    pixabayApi
      .serviceImages(page, question, order)
      .then(({ hits, totalHits } = {}) => {
        if (totalHits > 0) {
          queryTotalHints = totalHits;
          elements.gallery.innerHTML = createMarkup(hits);
          elements.loadMoreBtn.classList.toggle(
            'hiden-element',
            totalHits <= 40
          );
        } else {
          iziToast.warning({
            position: 'center',
            title: 'Sorry,',
            message:
              'there are no images matching your search query. Please try again.',
          });
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
          <img src="${webformatURL}" alt="${tags}" data-large-url="${largeImageURL}" loading="lazy" />
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
          </div>
          </div>
    `
    )
    .join('');
}
