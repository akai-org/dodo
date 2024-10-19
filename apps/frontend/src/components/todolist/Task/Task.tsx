import { FC } from 'react';
import styles from './Task.module.scss';

interface TaskProps {
    taskName: string;
    isChecked: boolean;
    onToggle: (taskName: string) => void;
}

const Task: FC<TaskProps> = ({ taskName, isChecked, onToggle }) => {
    const toggleCheckbox = () => {
        onToggle(taskName);
    };

    return (
        <div className={styles.task}>
            <label htmlFor={taskName}>
                <div className={styles.checkboxContainer}>
                    <input 
                        type="checkbox" 
                        id={taskName}
                        checked={isChecked} 
                        onChange={toggleCheckbox}
                    />
                    <div className={styles.checkIcon}>
                        {isChecked && <i className="ri-check-line"></i>}
                    </div>
                </div>
                {taskName}
            </label>
        </div>
    );
};

export default Task;
