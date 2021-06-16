
import styles from './Spinner.module.css';
function Spinner() {
    return (
        <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
            <div>불러오는 중...</div>
        </div>
    );
}

export default Spinner;