(function () {
  const store = window.CreationsStore;
  const form = document.getElementById('creation-form');
  if (!form || !store) return;
  if (!window.SodamAuth?.requireLogin('login.html')) return;

  const $ = selector => document.querySelector(selector);
  const list = $('#collection-list');
  const empty = $('#collection-empty');
  const count = $('#collection-count');
  const title = $('#creation-title');
  const description = $('#creation-description');
  const category = $('#creation-category');
  const date = $('#creation-date');
  const publish = $('#creation-publish');
  const idField = $('#creation-id');
  const photosInput = $('#creation-photos');
  const previews = $('#photo-previews');
  const status = $('#form-status');
  const formTitle = $('#form-title');
  const photoStatus = $('#photo-status');
  const photoTemplate = $('#photo-template');
  const deleteDialog = $('#delete-dialog');
  let photos = [];
  let deletingId = null;
  let resetting = false;

  const categoryNames = {
    pavlova: 'Pavlova', 'dome-cakes': 'Dome cakes', 'custom-cakes': 'Custom cakes',
    'fruit-cakes': 'Fruit cakes', seasonal: 'Seasonal'
  };
  const escapeText = value => String(value || '');

  function renderPhotos() {
    previews.replaceChildren();
    photos.forEach((src, index) => {
      const fragment = photoTemplate.content.cloneNode(true);
      const item = fragment.querySelector('.photo-preview');
      const image = fragment.querySelector('img');
      image.src = src;
      image.alt = `Creation photo ${index + 1}`;
      fragment.querySelector('.photo-preview__label').textContent = index === 0 ? 'Cover photo' : `Detail photo ${index}`;
      fragment.querySelector('[data-action="remove-photo"]').dataset.index = index;
      previews.append(item);
    });
    photoStatus.textContent = photos.length
      ? `${photos.length} photo${photos.length === 1 ? '' : 's'} · First image is the cover.`
      : 'No photos yet · The first image will be your cover. Add more views to tell the whole little story.';
  }

  function renderCollection() {
    const items = store.all().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    list.replaceChildren();
    items.forEach(item => {
      const row = document.createElement('li');
      row.className = `creation-row${item.status === 'draft' ? ' is-draft' : ''}`;
      row.dataset.id = item.id;
      const image = document.createElement('img');
      image.className = 'creation-row__img';
      image.src = item.photos?.[0] || '../assets/logo/sodam-logo.png';
      image.alt = '';
      image.width = 72;
      image.height = 72;
      const info = document.createElement('div');
      info.className = 'creation-row__info';
      const name = document.createElement('h3');
      name.className = 'creation-row__title';
      name.textContent = escapeText(item.title);
      const cat = document.createElement('p');
      cat.className = 'creation-row__category';
      cat.textContent = categoryNames[item.category] || item.category;
      info.append(name, cat);
      const time = document.createElement('time');
      time.className = 'creation-row__date';
      time.dateTime = item.date || '';
      time.textContent = item.date ? new Date(`${item.date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
      const actions = document.createElement('div');
      actions.className = 'creation-row__actions';
      const badge = document.createElement('span');
      badge.className = `chip chip--status chip--${item.status === 'published' ? 'published' : 'draft'}`;
      badge.textContent = item.status === 'published' ? 'Published' : 'Draft';
      const edit = document.createElement('button');
      edit.className = 'link-button';
      edit.type = 'button';
      edit.dataset.action = 'edit';
      edit.setAttribute('aria-label', `Edit ${item.title}`);
      edit.textContent = 'Edit';
      const remove = document.createElement('button');
      remove.className = 'link-button';
      remove.type = 'button';
      remove.dataset.action = 'delete';
      remove.setAttribute('aria-label', `Delete ${item.title}`);
      remove.textContent = 'Delete';
      actions.append(badge, edit, remove);
      row.append(image, info, time, actions);
      list.append(row);
    });
    count.textContent = `${items.length} ${items.length === 1 ? 'creation' : 'creations'}`;
    empty.hidden = items.length > 0;
  }

  function resetForm() {
    resetting = true;
    form.reset();
    resetting = false;
    idField.value = '';
    publish.checked = true;
    photos = [];
    renderPhotos();
    formTitle.textContent = 'Add a new creation';
    $('.form-card').classList.remove('is-editing');
    status.hidden = true;
  }

  function editCreation(id) {
    const item = store.find(id);
    if (!item) return;
    idField.value = item.id;
    title.value = item.title || '';
    description.value = item.description || '';
    category.value = item.category || '';
    date.value = item.date || '';
    publish.checked = item.status === 'published';
    photos = [...(item.photos || [])];
    renderPhotos();
    formTitle.textContent = 'Edit creation';
    $('.form-card').classList.add('is-editing');
    status.hidden = true;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    title.focus({ preventScroll: true });
  }



  photosInput.addEventListener('change', async () => {
    status.hidden = true;
    try {
      for (const file of photosInput.files) photos.push(await window.SodamImages.read(file));
      renderPhotos();
    } catch (error) {
      status.textContent = error.message;
      status.hidden = false;
    }
    photosInput.value = '';
  });

  previews.addEventListener('click', event => {
    const button = event.target.closest('[data-action="remove-photo"]');
    if (!button) return;
    photos.splice(Number(button.dataset.index), 1);
    renderPhotos();
  });

  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    category.value = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach(chip => {
      const selected = chip === button;
      chip.classList.toggle('is-active', selected);
      chip.setAttribute('aria-pressed', String(selected));
    });
  }));
  category.addEventListener('change', () => {
    document.querySelectorAll('[data-category]').forEach(chip => {
      const selected = chip.dataset.category === category.value;
      chip.classList.toggle('is-active', selected);
      chip.setAttribute('aria-pressed', String(selected));
    });
  });
  publish.addEventListener('change', () => {
    $('#publish-text').textContent = publish.checked ? $('#publish-text').dataset.on : $('#publish-text').dataset.off;
  });

  form.addEventListener('reset', () => {
    if (!resetting) setTimeout(resetForm);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.hidden = true;
    if (!form.reportValidity()) return;
    const submitter = event.submitter;
    const publishStatus = submitter?.value === 'draft' || !publish.checked ? 'draft' : 'published';
    const existing = idField.value ? store.find(idField.value) : null;
    const id = existing?.id || `${store.slugify(title.value)}-${Date.now().toString(36)}`;
    const item = {
      id,
      title: title.value.trim(),
      description: description.value.trim(),
      category: category.value,
      date: date.value,
      status: publishStatus,
      photos,
      updatedAt: new Date().toISOString()
    };
    try {
      store.upsert(item);
      renderCollection();
      status.textContent = publishStatus === 'published' ? 'Saved! Your creation is now in the gallery.' : 'Saved as a draft. Visitors cannot see it yet.';
      status.hidden = false;
      resetForm();
      status.hidden = false;
      status.textContent = publishStatus === 'published' ? 'Saved! Your creation is now in the gallery.' : 'Saved as a draft. Visitors cannot see it yet.';
    } catch (error) {
      status.textContent = error.message;
      status.hidden = false;
    }
  });

  list.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const row = button.closest('[data-id]');
    if (button.dataset.action === 'edit') editCreation(row.dataset.id);
    if (button.dataset.action === 'delete') {
      deletingId = row.dataset.id;
      if (deleteDialog.showModal) deleteDialog.showModal();
    }
  });

  $('#confirm-remove').addEventListener('click', event => {
    event.preventDefault();
    if (!deletingId) return;
    store.remove(deletingId);
    if (idField.value === deletingId) resetForm();
    deletingId = null;
    deleteDialog.close('remove');
    renderCollection();
  });

  document.addEventListener('sodam:data-changed', renderCollection);
  renderPhotos();
  renderCollection();
})();
