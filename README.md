# Prerequisite

* create a directory `<project_dir>/assets/source` and put the image layers similar as the following
```
assets/
└── source
    ├── common_100          // format <any_name>_<sample_size>
    │   ├── 0               // layer 0
    │   │   ├── bg_1.png    // any png
    │   │   ├── bg_2.png
    │   │   ├── bg_3.png
    │   │   ├── bg_4.png
    │   │   └── bg_5.png
    │   ├── 1               // layer 1
    │   │   ├── sk_1.png
    │   │   ├── sk_2.png
    │   │   ├── sk_3.png
    │   │   ├── sk_4.png
    │   │   └── sk_5.png
    │   └── 2
    │       ├── ey_0.png
    │       ├── ey_1.png
    │       ├── ey_2.png
    │       ├── ey_3.png
    │       ├── ey_4.png
    │       ├── ey_5.png
    │       └── ey_6.png
    ├── epic_1
    │   ├── 0
    │   │   ├── bg_1.png
    │   │   ├── bg_2.png
    │   │   ├── bg_3.png
    │   │   ├── bg_4.png
    │   ├── 1
    │   │   └── sk_7.png
    │   └── 2
    │       ├── ey_15.png
    │       └── ey_16.png
    ├── legendary_1
    │   ├── 0
    │   │   ├── bg_1.png
    │   │   └── bg_2.png
    │   ├── 1
    │   │   └── sk_8.png
    │   └── 2
    │       ├── ey_17.png
    │       ├── ey_18.png
    │       ├── ey_19.png
    │       ├── ey_20.png
    │       └── ey_21.png
    └── rare_8
        ├── 0
        │   └── bg_1.png
        ├── 1
        │   └── sk_6.png
        └── 2
            ├── ey_17.png
            ├── ey_18.png
            ├── ey_19.png
            ├── ey_20.png
            └── ey_21.png
```

<br/><br/>

# Run in nodejs container
```
docker compose up
```

<br/><br/>

# Run in python container
```
docker compose -f docker-compose.python.yaml up
```

<br/><br/>

# Run on mac

## Prerequisite
* brew install the following packages (see [here](https://www.npmjs.com/package/canvas) for details)
```
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

## Run with python
```
pipenv install
pipenv shell
python main.py
```

## Run with nodejs
```
npm i
node main
```