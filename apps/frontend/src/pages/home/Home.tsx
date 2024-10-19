import {FC, ReactElement} from "react";

import styles from "./Home.module.scss";

const Home: FC = (): ReactElement => {
    return (
        <div className={styles.container}>
            <div> Welcome </div>
            {/* <button onClick={handleLogout}> LOGOUT </button> */}
        </div>
    );
}

export default Home;