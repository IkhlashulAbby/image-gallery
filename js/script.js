const imagesWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');
const lightbox = document.querySelector('.lightbox');
const closeBtn = lightbox.querySelector('.uil-times');
const downloadBtn = lightbox.querySelector('.uil-import');

const apiKey = 'fBUw2cjkkEnZPFYdCT2sgjB82cN3ZtGzHn5sYrpoDey5OWcn0m9We32a';
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert('Failed to Download Image!'));
};

const showLightbox = (name, img) => {
  lightbox.querySelector('img').src = img;
  lightbox.querySelector('span').innerText = name;
  downloadBtn.setAttribute('data-img', img);
  lightbox.classList.add('show');
  document.body.style.overflow = 'hidden';
};

const hideLightbox = () => {
  lightbox.classList.remove('show');
  document.body.style.overflow = 'auto';
};

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (img) => `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
  <img src="${img.src.large2x}" />
  <div class="details">
    <div class="photographer">
      <i class="uil uil-camera"></i>
      <span>${img.photographer}</span>
    </div>
    <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();"><i class="uil uil-import"></i></button>
  </div>
</li>`
    )
    .join('');
};

const getImages = (apiURL) => {
  loadMoreBtn.innerText = 'Loading...';
  loadMoreBtn.classList.add('disabled');
  fetch(apiURL, {
    headers: { authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);
      loadMoreBtn.innerText = 'Load More';
      loadMoreBtn.classList.remove('disabled');
    })
    .catch(() => alert('Failed to Load Images!'));
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
  getImages(apiURL);
};
const loadSearchImages = (e) => {
  if (e.target.value === '') return (searchTerm = null);
  if (e.key === 'Enter') {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = '';
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
  }
};
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hideLightbox);
downloadBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));
