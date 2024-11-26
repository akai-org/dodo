import {FC, ReactElement} from "react";
import styles from './Notes.module.scss';
import Note from '../../components/notes/Note';


const Notes: FC = (): ReactElement => {
    return (
      <div className={styles.wrapper}>
        <Note/>
      </div>
    )
}

export default Notes;
