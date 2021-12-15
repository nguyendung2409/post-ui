import postApi from './api/postApi';
import { initPostForm } from './utils';

// Main
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    let defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };
    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => console.log(formValues),
    });
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
