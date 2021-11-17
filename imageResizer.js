const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const args = process.argv.slice(2);
const [FOLDER, IMAGE_COUNT, EXT] = args;

const init = () => {
  fs.readdirSync(FOLDER).forEach((file) => {
    const {base, name, ext} = path.parse(file);
    processImage(base, name, ext);
  });
}

const processImage = (fullName, name, extension) => {
  const image = sharp(`${FOLDER}/${fullName}`);
  image
    .metadata()
    .then((metadata) => {
      let currentPercentage = 0;
      const percentageArray = [];
      while (currentPercentage < 100) {
        currentPercentage = currentPercentage + (100 / IMAGE_COUNT);
        percentageArray.push(currentPercentage);
      }
      const widthsArray = percentageArray.map(percentage => Math.ceil(metadata.width * percentage / 100));
      for (const width of widthsArray) {
        generateImage(image, width, name, extension);
      }
    })
}

const generateImage = (image, width, name, ext) => {
  const extension = EXT ? `.${EXT}` : ext;
  const newImagePath = `${FOLDER}/${name}-${width}${extension}`;
  return image
    .resize(width)
    .toFile(newImagePath, (err, info) => {
      if (err) {
        console.log(`ERROR: ${newImagePath}`);
        console.log(err);
      } else {
        console.log(`CREATED: ${newImagePath}`);
      }
    });
};

if (args.length < 2) {
  console.log('Usage: node imageResizer.js <folder> <image-count> [<extension>]');
} else {
  init();
}
