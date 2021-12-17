import { setBackgroundImage, setFieldValue } from './common';
import * as yup from 'yup';
import { setTextContent } from './common';
import { randomNumber } from './common';

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
    imageUrl: yup
      .string()
      .required('Please random a backgroundImage')
      .url('Please enter a valid url'),
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
    ['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''));
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
function showLoading(form) {
  const button = form.querySelector('[name=submit]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name=submit]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}
function ramdomImage(form) {
  const ramdomButton = document.getElementById('postChangeImage');
  if (!ramdomButton) return;
  ramdomButton.addEventListener('click', () => {
    // build imageUrl
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;
    // set imageUrl for input + backgroundImage

    setFieldValue(form, "[name='imageUrl']", imageUrl);

    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}
function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll("[data-id='imageSource']");
  if (!controlList) return;
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}
function initRadioImageSource(form) {
  const radioList = form.querySelectorAll("[name='imageSource']");
  if (!radioList) return;
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value));
  });
}
export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;
  setFormValues(form, defaultValues);
  ramdomImage(form);
  initRadioImageSource(form);
  let submitting = false;
  // get form values
  // validation
  // if valid trigger submit callback
  // otherwise , show message errror
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Prevent other submission
    if (submitting) return;
    showLoading(form);
    submitting = true;

    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;
    const isValid = await validatePostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);
    // always hide loading no matter form is valid or not
    hideLoading(form);
    submitting = false;
  });
}
