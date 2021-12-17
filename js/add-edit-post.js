import postApi from './api/postApi.js';
import { imageSource, initPostForm, toast } from './utils';
function removeUnusedFields(formValues) {
  const payload = { ...formValues };
  // imageSource = picsum -> remove image
  // imageSource = upload -> remove imageUrl
  if (payload.imageSource === imageSource.PICSUM) delete payload.image;
  if (payload.imageSource === imageSource.UPLOAD) delete payload.imageUrl;
  // remove imageSource
  delete payload.imageSource;
  if (!payload.id) delete payload.id;
  return payload;
}
function jsonToFormData(jsonObject) {
  const formData = new FormData();
  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }
  return formData;
}
async function handleSubmitForm(formValues) {
  try {
    // check add/edit mode
    // call API
    const payload = removeUnusedFields(formValues);

    const formData = jsonToFormData(payload);

    const savedPost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);
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
