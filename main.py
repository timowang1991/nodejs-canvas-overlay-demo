from os import listdir, path, getenv, mkdir
from random import shuffle
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import time

ASSET_PATH = getenv('ASSET_PATH', 'assets')
ASSET_SRC_PATH = path.join(ASSET_PATH, 'source')
ASSET_DEST_PATH = path.join(ASSET_PATH, 'dest')

def generate_all_combinations_in_group(group: str):
    group_path = path.join(ASSET_SRC_PATH, group)
    sorted_layers = sorted(list(map(lambda l : int(l), listdir(group_path))))
    layers = list(map(lambda l : str(l), sorted_layers))

    combinations = []

    for layer in layers:
        layer_path = path.join(group_path, layer)
        layer_files = listdir(layer_path)

        newCombinations = []
        for layer_file in layer_files:

            if len(combinations) == 0:
                newCombinations = list(map(lambda lf : path.join(layer_path, lf), layer_files))
                break

            for combination in combinations:
                newCombinations.append(f'{combination},{path.join(layer_path, layer_file)}')

        combinations = newCombinations

    return combinations

def generate_overlay_images(paths_in_string: str, index: int):
    paths = paths_in_string.split(',')

    final_image = None

    for p in paths:
        img = Image.open(p).convert('RGBA')
        if not final_image:
            final_image = img
        else:
            final_image.paste(img, mask=img)
    
    final_image.save(path.join(ASSET_DEST_PATH, f'{index}.png'), format='png')

def main():
    if not path.exists(ASSET_DEST_PATH):
        mkdir(ASSET_DEST_PATH)

    groups = listdir(ASSET_SRC_PATH)

    combinations = []

    for group in groups:
        group_combinations = generate_all_combinations_in_group(group)
        print('group_combinations', group_combinations)
        shuffle(group_combinations)

        [_, sample_size] = group.split('_')

        combinations += group_combinations[:int(sample_size)]

    shuffle(combinations)

    start_time = time.time()
    with ThreadPoolExecutor(max_workers=20) as executor:
        for i, combination in enumerate(combinations):
            executor.submit(generate_overlay_images, combination, i)
    print(f'images generated in {time.time() - start_time} seconds')

if __name__ == '__main__':
    main()