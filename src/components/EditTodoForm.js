import React, { useState } from "react";

export const EditTodoForm = ({editTodo,task}) => {

    // addTodo is passed as childcomponent or prop to be accessed as function

    const [value,setValue] = useState(task.task);
    const handleSubmit = e => {
        e.preventDefault();
        //this is to prevent default actions;
        //passing the value throught editTodo from todo wrapper and task.id that will help to display updte task
        
        editTodo(value,task.id)
        //  while we submit set value to be  empty 
        setValue("")
    }

    return (
        <form className="TodoForm" onSubmit={handleSubmit}>
            <input type="text" className="todo-input" value={value}  placeholder="Update task" onChange={(e) => setValue(e.target.value)}/>
            <button type="submit" className="todo-btn">Update Task</button>
        </form>
    )
}
