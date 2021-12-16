import postApi from './api/postApi.js';
import { initPagination, initSearch, renderPagination, renderPostList } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);
    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    window.history.pushState({}, '', url);

    // fetch API
    // re-render post list, pagination
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed to fetch post list', error);
  }
}

(async () => {
  // update queryParams if needed
  const url = new URL(window.location);
  const page = url.searchParams.get('_page');
  const limit = url.searchParams.get('_limit');
  if (!page) url.searchParams.set('_page', 1);
  if (!limit) url.searchParams.set('_limit', 6);

  // TODOS: handle if user type param is invalid
  // solution : checkValidParam(str) => number.parseInt(str).toString === str

  window.history.pushState({}, '', url);
  const queryParams = url.searchParams;
  // attach event for prev/next link
  initPagination({
    elementId: 'pagination',
    defaultParams: queryParams,
    onChange: (page) => handleFilterChange('_page', page),
  });

  // attach event for search input
  initSearch({
    elementId: 'searchInput',
    defaultParams: queryParams,
    onChange: (value) => handleFilterChange('title_like', value),
  });
  try {
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
