import dayjs from 'dayjs';
import postApi from './api/postApi';
import { registerLightbox, setTextContent } from './utils';

function renderPostDetail(post) {
  if (!post) return;
  // render title , desc, author , timeSpan
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm')
  );
  // render Image , editLink
  const heroImage = document.getElementById('postHeroImage');
  if (!heroImage) return;
  heroImage.style.backgroundImage = `url(${post.imageUrl})`;
  heroImage.addEventListener('error', () => {
    const defaultImageAddress = 'https://via.placeholder.com/1368x400?text=thumbnail';
    heroImage.style.backgroundImage = `url(${defaultImageAddress})`;
  });

  const editLink = document.getElementById('goToEditPageLink');
  if (!editLink) return;
  editLink.href = `/add-edit-post.html?id=${post.id}`;
  editLink.innerHTML = '<i class="far fa-edit"></i> Edit Post';
}
(async () => {
  registerLightbox({
    modalId: 'lightbox',
    imgSelector: "img[data-id='lightboxImg']",
    prevSelector: "button[data-id='lightboxPrev']",
    nextSelector: "button[data-id='lightboxNext']",
  });

  registerLightbox({
    modalId: 'lightbox',
    imgSelector: "img[data-id='lightboxImg']",
    prevSelector: "button[data-id='lightboxPrev']",
    nextSelector: "button[data-id='lightboxNext']",
  });
  // get postId
  // fetch post detail API
  // render post detail
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    // should redirect to 404 not found page
    if (!postId) return;
    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
