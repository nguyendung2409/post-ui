function getListPaging(totalRecord, limit, currentPage) {
  const listPaging = [];
  // Get totoal Page
  let totalPage =
    totalRecord % limit === 0
      ? Math.trunc(totalRecord / limit)
      : Math.trunc(totalRecord / limit) + 1;
  // Get max page per paging
  let limitPage = 3;
  // Get position of listPaging
  let positionOfListPaging = Math.floor((currentPage - 1) / limitPage);
  // Get first page in listpaging
  let firstPage = limitPage * positionOfListPaging + 1;
  // Get last page in listpaging
  let lastPage = limitPage * (positionOfListPaging + 1);
  // Compare totalPage with last page
  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  // Return list paging
  for (let i = firstPage; i <= lastPage; i++) {
    listPaging.push(i);
  }
  return listPaging;
}

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

  // get list paging
  const listPaging = getListPaging(_totalRows, _limit, _page);
  const lastItemElement = ulPagination.lastElementChild;
  const template = document.getElementById('postTemplate');
  if (!template) return;

  // clear list paging
  const pageItemNumberList = ulPagination.querySelectorAll("[data-id='pageNumber']");
  pageItemNumberList.forEach((pageItemNumber) => pageItemNumber.remove());

  // render list paging
  for (const pageNumber of listPaging) {
    const pageItemElement = template.content.lastElementChild.cloneNode(true);
    const pageLinkElement = pageItemElement.querySelector('.page-link');
    if (pageLinkElement) {
      pageItemElement.dataset.pageNumber = pageNumber;
      pageLinkElement.textContent = pageNumber;

      ulPagination.insertBefore(pageItemElement, lastItemElement);
    }

    // set current active pages
    if (Number.parseInt(pageItemElement.dataset.pageNumber) === _page) {
      pageItemElement.classList.add('active');
    }
    pageItemElement.addEventListener('click', (event) => {
      event.preventDefault();

      window.location.assign(`?_page=${pageNumber}&_limit=6`);
    });
  }
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // bind click event for prev/next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

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
  // attach click event for list paging
}
