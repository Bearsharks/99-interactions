# 이미지 모자이크
## 소개
이미지 모자이크는 웹상에서 검색된 여러 이미지를 사용하여, 하나의 사진을 구성하는 사진 모자이크를 만들어주는 웹페이지 입니다.
하나의 사진을 약 10000개의 조각으로 나누고, 대상 사진과 비슷한 주제의 이미지를 비슷한 평균 밝기을 가진 조각에 맵핑하여 이미지 모자이크를 구성합니다.

## 특징
* 각 모자이크 조각에 비슷한 주제를 가진 이미지를 사용하여 통일감을 주는 이미지 모자이크 생성
* 캐싱과 웹워커를 이용한 병렬처리로 저사양 기기에서도 이미지처리 속도 보장
* 데스크톱 및 모바일 기기 지원

## 사용기술
* Bing Image Search REST API
* Azure functions
* HTML5 Canvas
* Web Worker
* REACT

## 한번 해보기
[https://bearsharks.github.io/99-interactions](https://bearsharks.github.io/99-interactions)
