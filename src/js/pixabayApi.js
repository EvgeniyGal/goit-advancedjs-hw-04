import axios from 'axios';

async function serviceImages(page = 1, question, order = 'popular') {
  const params = {
    image_type: 'photo',
    page,
    key: '40827343-3d4cfe2da7e34096e28537a58',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    q: question,
    order,
  };

  return (await axios.get('https://pixabay.com/api/', { params })).data;
}

export { serviceImages };
