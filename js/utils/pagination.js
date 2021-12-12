export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;

  // calc total page
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save totalPages , page to ulPagination

  if (!ulPagination) return;
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if enable/disable prev /next link
  if (_page <= 1) ulPagination.firstElementChild.classList.add('disabled');
  else ulPagination.firstElementChild.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild.classList.add('disabled');
  else ulPagination.lastElementChild.classList.remove('disabled');
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // bind click event for prev/next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // set current active pages
  
  // attach click event for prev click
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (!prevLink) return;
  prevLink.addEventListener('click', (e) => {
    e.preventDefault();
    const page = Number.parseInt(ulPagination.dataset.page) || 1;
    if (page >= 2) onChange?.(page - 1);
  });
  // attach click event for next click
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (!nextLink) return;
  nextLink.addEventListener('click', (e) => {
    e.preventDefault();
    const page = Number.parseInt(ulPagination.dataset.page) || 1;
    const totalPages = ulPagination.dataset.totalPages;
    if (page < totalPages) onChange?.(page + 1);
  });
}
