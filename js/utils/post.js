import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';

// to use fromNow function
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;
  // find , clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;
  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;
  // update title , desc , author , thumbnail

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`);

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }
  // attach event
  const postItemElement = liElement.firstElementChild;
  if (!postItemElement) return;
  postItemElement.addEventListener('click', (event) => {
    // if event is triggered from menu -> ignore
    const menu = liElement.querySelector("[data-id='menu']");
    if (menu && menu.contains(event.target)) return;
    window.location.assign(`/post-detail.html?id=${post.id}`);
  });

  const editButton = liElement.querySelector("[data-id='edit']");
  if (!editButton) return;
  editButton.addEventListener('click', () => {
    window.location.assign(`/add-edit-post.html?id=${post.id}`);
  });

  const removeButton = liElement.querySelector("[data-id='remove']");
  if (!removeButton) return;
  removeButton.addEventListener('click', () => {
    const customEvent = new CustomEvent('post-delete', {
      bubbles: true,
      detail: post,
    });
    removeButton.dispatchEvent(customEvent);
  });

  return liElement;
}

export function renderPostList(elmentId, postList) {
  if (!Array.isArray(postList)) return;
  const ulElement = document.getElementById(elmentId);
  if (!ulElement) return;
  // clear post list
  ulElement.textContent = '';
  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
