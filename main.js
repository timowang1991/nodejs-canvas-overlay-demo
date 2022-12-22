const fs = require('fs');
const fspromise = require('fs/promises');
const path = require('path');
const canvas = require('canvas');

const { ASSET_PATH = 'assets' } = process.env;

async function generateAllCombinationsInGroup(group) {
    const groupPath = path.resolve(ASSET_PATH, 'source', group);
    const layers = await fspromise.readdir(groupPath);

    let combinations;

    layers
        .map((layer) => +layer)
        .sort()
        .map((layer) => `${layer}`)
        .forEach((layer) => {
            const layerPath = path.resolve(groupPath, layer);
            const layerFiles = fs.readdirSync(layerPath);

            if (!combinations) {
                combinations = layerFiles.map((layerFile) => path.resolve(layerPath, layerFile));
                return;
            }
            combinations = combinations
                .map((prevLayerPaths) => {
                    return layerFiles
                        .map((layerFile) => path.resolve(layerPath, layerFile))
                        .map((layerFilePath) => `${prevLayerPaths},${layerFilePath}`);
                })
                .flat();
        });

    return combinations;
}

function shuffleArray(array) {
    const numberOfShuffles = Math.floor(array.length / 2);

    for (let i = 0; i < numberOfShuffles; i++) {
        const idx1 = Math.floor(Math.random() * array.length);
        const idx2 = Math.floor(Math.random() * array.length);

        const element1 = array[idx1];
        const element2 = array[idx2];

        array[idx1] = element2;
        array[idx2] = element1;
    }
}

async function generateOverlayImages(array) {
    await Promise.all(
        array.map(async (pathsInString, idx) => {
            console.time(`${idx}`);
            const out = fs.createWriteStream(`${ASSET_PATH}/dest/${idx + 1}.png`);

            const paths = pathsInString.split(',');
            console.log(`handling idx ${idx}, paths ${paths}`);
            const images = await Promise.all(paths.map((path) => canvas.loadImage(path)));
            console.log('images', images);
            const cvs = canvas.createCanvas(images[0].width, images[0].height);
            const ctx = cvs.getContext('2d');

            images.forEach((image) => {
                ctx.drawImage(image, 0, 0, images[0].width, images[0].height);
            });

            console.log(`writing idx ${idx}, paths ${paths} to file`);

            await new Promise((resolve) => {
                const stream = cvs.createPNGStream();
                stream.pipe(out);
                out.on('error', (e) => {
                    console.error(`error idx ${idx}, paths ${paths}, error ${e}`);
                });
                out.on('finish', () => {
                    console.log(`completed idx ${idx}, paths ${paths}`);
                    console.timeEnd(`${idx}`);
                    resolve();
                });
            });

            // await new Promise((resolve) => {
            //     fs.writeFile(`${ASSET_PATH}/dest/${idx + 1}.png`, cvs.toBuffer('image/png'), resolve);
            // });
            // console.log(`completed idx ${idx}, paths ${paths}`);
        }),
    );
}

async function main() {
    await fspromise.mkdir(`${ASSET_PATH}/dest`, { recursive: true });
    const groups = await fspromise.readdir(`${ASSET_PATH}/source`);

    const combinations = (
        await Promise.all(
            groups.map(async (group) => {
                const [, amountToGenerate] = group.split('_');
                const amount = +amountToGenerate;

                const combination = await generateAllCombinationsInGroup(group);
                shuffleArray(combination);

                return combination.slice(0, amount);
            }),
        )
    ).flat();
    shuffleArray(combinations);

    // await fspromise.writeFile(`${ASSET_PATH}/dest/combinations`, combinations.join('\n'), 'utf-8');
    await generateOverlayImages(combinations);
}

main().then();
