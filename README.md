# AIR GG Web Application

## Requirement

1. [Node JS LTS](https://nodejs.org/ko/)
2. python 3.x

## To Use

### Install dependencies

#### back-end
```sh
pip install django
pip install pymysql
pip install djangorestframework
```

#### front-end
```sh
npm install

or

yarn install
```


### Backend Server

```sh
python manage.py runserver 0.0.0.0:80
```

### Front-end Build Guide

```sh
npm run build

or

yarn build
```
빌드 결과는 airgg/build에 생성되며, 다음과 같이 생성된다.
1. air-vendor : package.json 파일에서 dependencies 중 import 한 대상들만 압축된 파일
2. air-common : common 코드 컴파일 된 결과 파일

### front-end development build guide
```sh
npm run watch

or

yarn watch
```
위와 같은 방법으로 빌드한 경우 디버깅하면 기존 코드와 같은 코드를 볼 수 있다.