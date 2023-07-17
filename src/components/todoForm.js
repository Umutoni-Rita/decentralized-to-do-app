import React, { useState } from "react";

export const TodoForm= ({addTodo}) => {

    // addTodo is passed as childcomponent or prop to be accessed as function

    const [value,setValue] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        //this is to prevent default actions;
        //passing the value throught addTodo from todo wrapper
        addTodo(value)
        //  while we submit set value to be  empty 
        setValue("")
    }

    return (
        <form className="TodoForm" onSubmit={handleSubmit}>
            <input type="text" className="todo-input" value={value}  placeholder="what is the task today" onChange={(e) => setValue(e.target.value)}/>
            <button type="submit" className="todo-btn">Add Task</button>
        </form>
    )
}
