import React from "react"
import styles from './Navigation.module.scss';
import { useRecoilState } from 'recoil';
import { isNavActive } from './atoms/atoms'

function Navigation() {
    const [isActive, setNavActive] = useRecoilState(isNavActive);
    const inActiveNav = (e) => {
        if (e.target.href) setNavActive(false);
    }
    return (
        <div
            onClick={inActiveNav}
            className={styles["navigation"] + " " + (isActive ? styles["navigation--active"] : styles["navigation--inactive"])}
        >
            네비게이션
        </div>
    );
}

export default Navigation;
