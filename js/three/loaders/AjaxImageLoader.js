function AjaxImageLoader() {

    const cache = THREE.Cache;

    // Turn on shared caching for FileLoader, ImageLoader and TextureLoader
    cache.enabled = true;

    const imageLoader = new THREE.ImageLoader();
    const fileLoader = new THREE.FileLoader();
    fileLoader.setResponseType('blob');

    function load(url, onLoad, onProgress, onError) {
        fileLoader.load(url, cacheImage, onProgress, onError);

        /**
         * The cache is currently storing a Blob, but we need to cast it to an Image
         * or else it won't work as a texture. TextureLoader won't do this automatically.
         */
        function cacheImage(blob) {
            // ObjectURLs should be released as soon as is safe, to free memory
			
            const objUrl = URL.createObjectURL(blob);
            const image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');

            image.onload = ()=> {
                cache.add(url, image);
                URL.revokeObjectURL(objUrl);
                document.body.removeChild(image);
                loadImage();
				
            };

            image.src = objUrl;
            image.style.visibility = 'hidden';
            document.body.appendChild(image);
        }

        function loadImage() {
            imageLoader.load(url, onLoad, ()=> {}, onError);
			cache.clear();
        }
    }

    return Object.assign({}, imageLoader, {load});
}