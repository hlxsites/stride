import { lookupPages } from '../../scripts/scripts.js';

function convertDate(serial) {
  const days = Math.floor(serial - 25569);
  const value = days * 86400;
  const date = new Date(value * 1000);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date) {
  const year = date.getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate() + 1;
  return `${month} ${day}, ${year}`;
}

export default async function decorate(block) {
  block.innerHTML = '';
  const index = await lookupPages();
  const pages = index.slice(0, 3);
  const wrapper = document.createElement('ul');
  pages.forEach((page) => {
    // setup card image
    const img = document.createElement('div');
    img.className = 'feed-card-image';
    img.innerHTML = `<picture>
        <img loading="lazy" src="${page.image}" alt="${page.title}" />
      </picture>`;
    // setup card body
    const body = document.createElement('div');
    body.className = 'feed-card-body';
    body.innerHTML = `<p class="feed-byline">
        <a class="feed-category" href="${page.path}">${page.category}</a>
        <span class="feed-date">${formatDate(convertDate(page.date))}</span>
      </p>
      <p class="feed-title">${page.title}</p>
      <p class="button-container feed-button">
        <a class="button primary" href="${page.path}">Read more</a>
      </p>`;
    // append card
    const a = document.createElement('a');
    a.href = page.path;
    a.append(img, body);
    const card = document.createElement('li');
    card.className = 'feed-card';
    card.append(a);
    wrapper.append(card);
  });
  block.append(wrapper);
}
