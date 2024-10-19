import styles from './ToDoTasks.module.scss';
import Task from '../Task/Task.tsx';
import {useState} from "react";

const ToDoTasks = () => {
    const [tasks, setTasks] = useState(["test1", "test2", "test3"]);
    const [checkedTasks, setCheckedTasks] = useState<string[]>([]);

    const toggleTask = (taskName: string) => {
        if (checkedTasks.includes(taskName)) {
            setCheckedTasks(checkedTasks.filter(task => task !== taskName));
        } else {
            setCheckedTasks([...checkedTasks, taskName]);
        }
        removeTask(taskName);
    };

    const removeTask = (taskName: string) => {
        setTimeout(() => {
            setTasks(tasks.filter(task => task !== taskName));
        }, 300);
    };

    return (
        <div className={styles.toDoTasks}>
            <div className={styles.title}>Tasks</div>
            <div className={styles.tasksContainer}>
                {tasks.map((task, index) => (
                    <Task 
                        key={index} 
                        taskName={task} 
                        isChecked={checkedTasks.includes(task)} 
                        onToggle={toggleTask} 
                    />
                ))}
            </div>
        </div>
    );
};

export default ToDoTasks;
