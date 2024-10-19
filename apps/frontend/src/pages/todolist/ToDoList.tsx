import styles from './ToDoList.module.scss';
import ToDoTasks from "../../components/todolist/ToDoTasks/ToDoTasks.tsx";
import ToDoEdit from "../../components/todolist/ToDoEdit/ToDoEdit.tsx";
import ToDoStatus from "../../components/todolist/ToDoStatus/ToDoStatus.tsx";
import ToDoLists from "../../components/todolist/ToDoLists/ToDoLists.tsx";

const ToDoList = () => {
    return (
        <div className={styles.container}>
            <div className={styles.middleContainer}>
                <ToDoTasks />
                <ToDoLists></ToDoLists>
            </div>
            <div className={styles.rightContainer}>
                <ToDoEdit />
                <ToDoStatus />
            </div>
        </div>
    );
};

export default ToDoList;
