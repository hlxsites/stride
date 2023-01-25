import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const MQ = window.matchMedia('(min-width: 800px)');

/**
 * Wraps images followed by links within a matching <a> tag.
 * @param {Element} container The container element
 */
function wrapImgsInLinks(container) {
  const pictures = container.querySelectorAll('picture');
  pictures.forEach((pic) => {
    const parent = pic.parentElement;
    const link = parent.nextElementSibling.querySelector('a');
    if (link && link.textContent.includes(link.getAttribute('href'))) {
      link.parentElement.remove();
      link.innerHTML = pic.outerHTML;
      parent.replaceWith(link);
    }
  });
}

/**
 * Toggles all footer drops
 * @param {Element} section The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllDrops(section, expanded = false) {
  section.querySelectorAll('ul > .footer-drop').forEach((drop) => {
    drop.setAttribute('aria-expanded', expanded);
  });
}

function placeLogo(block, logo, start) {
  if (MQ.matches) { // placement for desktop
    const dest = block.querySelector('.footer-reference > ul');
    if (dest) dest.append(logo);
  } else { // placement for mobile
    start.append(logo);
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    const classes = ['brand', 'logo', 'reference', 'social', 'copyright'];
    classes.forEach((c, i) => {
      const section = footer.children[i];
      if (section) section.classList.add(`footer-${c}`);
    });

    wrapImgsInLinks(footer);

    const dropdowns = footer.querySelectorAll('.footer-reference, .footer-social');
    if (dropdowns) {
      dropdowns.forEach((dropdown) => {
        dropdown.querySelectorAll(':scope > ul > li').forEach((drop) => {
          if (drop.querySelector('ul')) {
            drop.classList.add('footer-drop');
            drop.addEventListener('click', () => {
              if (!MQ.matches || dropdown.className.includes('social')) {
                const expanded = drop.getAttribute('aria-expanded') === 'true';
                toggleAllDrops(dropdown);
                drop.setAttribute('aria-expanded', expanded ? 'false' : 'true');
              }
            });
          }
        });
      });
    }

    // rewrap sections
    const reference = footer.querySelector('.footer-reference');
    if (reference) {
      const wrapper = document.createElement('div');
      wrapper.className = 'reference-wrapper';
      wrapper.append(reference);
      block.append(wrapper);
    }

    const social = footer.querySelector('.footer-social');
    if (social) {
      const wrapper = document.createElement('div');
      wrapper.className = 'social-wrapper';
      wrapper.append(social);
      block.append(wrapper);
      const drops = social.querySelectorAll('.footer-drop');
      drops.forEach((drop) => {
        const text = drop.textContent.split('\n')[0].trim();
        if (text) {
          drop.innerHTML = drop.innerHTML.replace(text, `<span class="label">${text}</span>`);
        }
      });
    }

    const copyright = footer.querySelector('.footer-copyright');
    if (copyright) {
      const wrapper = document.createElement('div');
      wrapper.className = 'copyright-wrapper';
      wrapper.append(copyright);
      block.append(wrapper);
    }

    [...footer.children].forEach((child) => {
      footer.classList.add(`${child.className.replace('footer-', '')}-wrapper`);
    });

    // setup logo replacement
    const logo = footer.querySelector('.footer-logo');
    if (logo) {
      const startPosition = logo.parentElement;
      placeLogo(block, logo, startPosition);
      MQ.addEventListener('change', () => placeLogo(block, logo, startPosition));
    }

    // prevent mobile footer behavior on window resize
    toggleAllDrops(reference, MQ.matches);
    MQ.addEventListener('change', () => toggleAllDrops(reference, MQ.matches));

    block.prepend(footer);
    decorateIcons(block);
  }
}
