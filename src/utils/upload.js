export const UPLOAD_SIZE_LIMIT = 3145728;
export const UPLOAD_SIZE_LIMIT_GIF = 1048576;
export const UPLOAD_SIZE_LIMIT_ERROR = 'File exceed the 3 Mb limit';
export const UPLOAD_SIZE_LIMIT_ERROR_GIF = 'File exceed the 1 Mb limit';
export const UPLAOD_ERROR_BASE = 'Error, try uploading file again later';
export const AVATAR_MAX_WIDTH = 300;
export const AVATAR_MAX_HEIGHT = 300;
export const IMAGE_MAX_WIDTH = 3840;
export const IMAGE_MAX_HEIGHT = 2160;

const getOrientation = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const view = new DataView(e.target.result);
    if (view.getUint16(0, false) !== 0xFFD8) {
      return callback(-2);
    }
    const length = view.byteLength;
    let offset = 2;
    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
      const marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xFFE1) {
        offset += 2;
        if (view.getUint32(offset, false) !== 0x45786966) {
          return callback(-1);
        }

        const little = view.getUint16(offset += 6, false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        const tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + (i * 12), little) === 0x0112) {
            return callback(view.getUint16(offset + (i * 12) + 8, little));
          }
        }
      } else if ((marker && 0xFF00) !== 0xFF00) {
        break;
      } else {
        offset += view.getUint16(offset, false);
      }
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
};

export const getBase64FromFile = (file) => {
  try {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Error: Can\'t get base 64 from file'));
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(file);
    });
  } catch (e) {
    return console.error(e);
  }
};

export const compressImageAndRotate = (file, maxWidth, maxHeight, type = 'image/jpeg', quality = 0.9) => (
  new Promise((resolve, reject) => {
    const fileName = file.name;
    if (file.type === 'image/gif') {
      if (file.size > UPLOAD_SIZE_LIMIT_GIF) {
        reject(UPLOAD_SIZE_LIMIT_ERROR_GIF);
      }
      resolve(file);
    }
    let srcOrientation;

    getOrientation(file, (orientation) => {
      srcOrientation = orientation;
    });

    getBase64FromFile(file)
      .then((result) => {
        const img = new Image();
        img.src = result;
        img.onload = () => {
          let { width, height } = img;

          if (srcOrientation > 4 && srcOrientation < 9) {
            while (height > maxWidth || width > maxHeight) {
              if (height > width && height > maxWidth) {
                width *= maxWidth / height;
                height = maxWidth;
              } else if (width > maxHeight) {
                height *= maxHeight / width;
                width = maxHeight;
              }
            }
          } else {
            while (width > maxWidth || height > maxHeight) {
              if (width > height && width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              } else if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
          }


          const canvasEl = document.createElement('canvas');
          const ctx = canvasEl.getContext('2d');

          // rotation images https://stackoverflow.com/a/40867559/9765570
          if (srcOrientation > 4 && srcOrientation < 9) {
            canvasEl.width = height;
            canvasEl.height = width;
          } else {
            canvasEl.width = width;
            canvasEl.height = height;
          }

          switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height, width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: break;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const newFileName = `${fileName.substr(0, fileName.lastIndexOf('.'))}.jpg`;
          ctx.canvas.toBlob((blob) => {
            const file = new File([blob], newFileName, {
              type,
              lastModified: Date.now(),
            });

            if (file.size > UPLOAD_SIZE_LIMIT) {
              reject(UPLOAD_SIZE_LIMIT_ERROR);
            }

            resolve(file);
          }, type, quality);
        };
      })
      .catch((err) => {
        reject(err);
      });
  })
);

export const compressAvatar = file => compressImageAndRotate(file, AVATAR_MAX_WIDTH, AVATAR_MAX_HEIGHT);
export const compressUploadedImage = file => compressImageAndRotate(file, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT);

export const getImageFromPasteEvent = async (event) => {
  const { items } = (event.clipboardData || event.originalEvent.clipboardData);
  let blob = null;

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') === 0) {
      blob = items[i].getAsFile();
    }
  }

  if (blob) {
    blob = await compressUploadedImage(blob);
  }

  return blob;
};

export const uploadDropState = {
  NOT_DROP: 0,
  IS_DROP: 1,
  IS_DROP_ON_FORM: 2,
};
