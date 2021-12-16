import { setBackgroundImage, setFieldValue } from './common';
import * as yup from 'yup';
import { setTextContent } from './common';

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
function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least two word',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  });
}
function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}
async function validatePostForm(form, formValues) {
  try {
    // reset previous errors
    ['title', 'author'].forEach((name) => setFieldError(form, name, ''));
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    // get errors
    // set errors
    const errorLog = {};

    for (const validationError of error.inner) {
      const name = validationError.path;
      if (errorLog[name]) continue;

      setFieldError(form, name, validationError.message);

      errorLog[name] = true;
    }
  }

  // add class was-validated to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}
export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValues);
  // get form values
  // validation
  // if valid trigger submit callback
  // otherwise , show message errror
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;
    const isValid = await validatePostForm(form, formValues);
    if (!isValid) return;
    onSubmit?.(formValues);
  });
}
