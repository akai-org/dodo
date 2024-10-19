import {FC, ReactElement} from "react";
import styles from "./ScrollableContainer.module.scss";

interface ScrollableContainerProps {
    children?: ReactElement;
}

const ScrollableContainer: FC<ScrollableContainerProps> = ({children}): ReactElement | undefined => {
    return (
        <section className={styles.container}>
            <div className={styles.wrapper}>{children}</div>
        </section>
    );
}

export default ScrollableContainer;
