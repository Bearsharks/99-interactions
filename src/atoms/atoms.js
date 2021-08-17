import { atom } from 'recoil';
export const isNavActive = atom({
    key: 'isNavActive',
    default: true
});

export const headerActive = atom({
    key: 'headerActive',
    default: true
});
export const backBtnState = atom({
    key: 'backBtnState',
    default: false
})