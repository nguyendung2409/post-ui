import { setBackgroundImage, setFieldValue } from './common';

function setFormValues(form, formValues) {
  setFieldValue(form, "[name='title']", formValues?.title);
  setFieldValue(form, "[name='author']", formValues?.author);
  setFieldValue(form, "[name='description']", formValues?.description);
  // hidden field
  setFieldValue(form, "[name='imageUrl']", formValues?.imageUrl);

  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  if (!form) return;
  const formValues = {};
  // query each input and add to object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name=${name}]`);
  //   if (field) formValues[name] = field.value;
  // });
  // use FormData
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }
  return formValues;
}
export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValues);
  // get form values
  // validation
  // if valid trigger submit callback
  // otherwise , show message errror
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formValues = getFormValues(form);
    console.log(formValues);
  });
}
