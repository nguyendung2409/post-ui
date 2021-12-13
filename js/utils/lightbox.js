function showModal(modalElement) {
  var modal = new bootstrap.Modal(modalElement);
  if (modal) modal.show();
}
// handle click for all imgs
// img click => find all img for album
// determine index of selected img
// show modal with selected img
// handle prev/next click
export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;
  if (modalElement.dataset.registered) return;
  const imgElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imgElement || !prevButton || !nextButton) return;

  let imgList = [];
  let currentIndex = 0;
  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src;
  }
  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    imgList = document.querySelectorAll(`img[data-album=${target.dataset.album}]`);

    currentIndex = [...imgList].findIndex((x) => x === target);
    showImageAtIndex(currentIndex);
    showModal(modalElement);
  });
  prevButton.addEventListener('click', () => {
    // show prev img of currentImg
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(currentIndex);
  });
  nextButton.addEventListener('click', () => {
    //show next img of currentImg
    currentIndex = (currentIndex + 1) % imgList.length;
    showImageAtIndex(currentIndex);
  });

  // mark this modal is already registered
  modalElement.dataset.registered = 'true';
}
