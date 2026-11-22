(function () {
  async function read(file, { maxBytes = 10 * 1024 * 1024, maxDimension = 1200, quality = 0.78 } = {}) {
    if (!file || !/^image\/(jpeg|png)$/.test(file.type)) throw new Error('Choose a JPG or PNG image.');
    if (file.size > maxBytes) throw new Error('The image must be under 10 MB.');
    const source = await new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('Could not read this image.')); reader.readAsDataURL(file);
    });
    const image = await new Promise((resolve, reject) => { const node = new Image(); node.onload = () => resolve(node); node.onerror = () => reject(new Error('Could not open this image.')); node.src = source; });
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser cannot process the selected image.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  }
  window.SodamImages = { read };
})();
