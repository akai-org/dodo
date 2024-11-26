import {FC, ReactElement} from 'react';
import styles from './Note.module.scss';

const Note: FC = (): ReactElement => {
  
  return(
    <div className={styles.wrapper}> 
      <div className={styles.header}>
        <p>Header</p>
      </div>
      <div className={styles.body}>
        <p>Body</p>
      </div>
    </div>
  )

}

export default Note;
