import postApi from './api/postApi.js';
import { initPostForm, toast } from './utils';
async function handleSubmitForm(formValues) {
  try {
    // check add/edit mode
    // call API

    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);
    // show success message
    toast.success('Save post successfully');
    // redirect to post-detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error: ${error.message}`);
  }
}
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
      onSubmit: handleSubmitForm,
    });
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
