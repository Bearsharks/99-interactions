
import styles from './Spinner.module.css';
import PropTypes from 'prop-types';
function Spinner(props) {
    return (
        <div className={styles.spinnerWrapper + (props.isDarkMode ? ` ${styles["spinnerWrapper--darkmode"]}` : "")}>
            <div className={styles.spinner}></div>
            <div>불러오는 중...</div>
        </div>
    );
}

// props의 초깃값을 정의합니다.
Spinner.defaultProps = {
    isDarkMode: false,
};

Spinner.propTypes = {
    isDarkMode: PropTypes.bool,
};
export default Spinner;