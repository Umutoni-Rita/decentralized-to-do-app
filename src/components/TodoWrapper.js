import React, { useState, useEffect } from "react";
import { TodoForm } from "./todoForm";
import { Todo } from "./todo";
import { EditTodoForm } from "./EditTodoForm";
import { initWeb3, getWeb3, getTodoList } from "../web3";
import Web3 from "web3";

export const TodoWrapper = () => {
    const [account, setAccount] = useState('');
    const [todos, setTodos] = useState([]);
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        const init = async () => {
            await initWeb3();
            const web3Instance = getWeb3();
            setWeb3(web3Instance);
            const accounts = await web3Instance.eth.getAccounts();
            setAccount(accounts[0]);
            const todoList = getTodoList();
            setContract(todoList);
            loadTasks(todoList);
        };

        init();
    }, []);

    const loadTasks = async (todoList) => {
        const taskCount = await todoList.methods.taskCount().call();
        const loadedTasks = [];
        for (let i = 1; i <= taskCount; i++) {
            const task = await todoList.methods.tasks(i).call();
            loadedTasks.push({ id: task.id, task: task.content, completed: task.completed, isEditing: false });
        }
        setTodos(loadedTasks);
    };

    const addTodo = async (todo) => {
        if (contract && account && web3) {
            try {
                const supportsEIP1559 = await web3.eth.getBlock('latest').then(block => block.baseFeePerGas !== undefined);

                let transactionParams = {
                    from: account,
                    gas: '5000000'
                };

                if (supportsEIP1559) {
                    transactionParams.maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');
                    transactionParams.maxFeePerGas = web3.utils.toWei('100', 'gwei');
                } else {
                    const gasPrice = await web3.eth.getGasPrice();
                    transactionParams.gasPrice = gasPrice;
                }

                await contract.methods.createTask(todo).send(transactionParams);
                const taskCount = await contract.methods.taskCount().call();
                const task = await contract.methods.tasks(taskCount).call();
                setTodos([...todos, { id: task.id, task: task.content, completed: task.completed, isEditing: false }]);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    const toggleComplete = async (id) => {
        try {
            const supportsEIP1559 = await web3.eth.getBlock('latest').then(block => block.baseFeePerGas !== undefined);
    
            let transactionParams = {
                from: account,
                gas: '5000000'
            };
    
            if (supportsEIP1559) {
                transactionParams.maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');
                transactionParams.maxFeePerGas = web3.utils.toWei('100', 'gwei');
            } else {
                const gasPrice = await web3.eth.getGasPrice();
                transactionParams.gasPrice = gasPrice;
            }
    
            await contract.methods.completeTask(id).send(transactionParams);
            setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    const deleteTodo = async (id) => {
        try {
            const supportsEIP1559 = await web3.eth.getBlock('latest').then(block => block.baseFeePerGas !== undefined);
    
            let transactionParams = {
                from: account,
                gas: '5000000'
            };
    
            if (supportsEIP1559) {
                transactionParams.maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');
                transactionParams.maxFeePerGas = web3.utils.toWei('100', 'gwei');
            } else {
                const gasPrice = await web3.eth.getGasPrice();
                transactionParams.gasPrice = gasPrice;
            }
    
            await contract.methods.deleteTask(id).send(transactionParams);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    const editTodo = (id) => {
        console.log(id)
        setTodos(todos.map(todo => todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo));
    };

    const editTask = async (task, id) => {
        try {
            const transactionParams = {
                from: account,
                gas: '5000000'
            };
    
            const supportsEIP1559 = await web3.eth.getBlock('latest').then(block => block.baseFeePerGas !== undefined);
    
            if (supportsEIP1559) {
                transactionParams.maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');
                transactionParams.maxFeePerGas = web3.utils.toWei('100', 'gwei');
            } else {
                const gasPrice = await web3.eth.getGasPrice();
                transactionParams.gasPrice = gasPrice;
            }
    
            await contract.methods.updateTask(id, task).send(transactionParams);
            setTodos(todos.map(todo => todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo));
        } catch (error) {
            console.error("Error editing task:", error);
        }
    };

    return (
        <div className="TodoWrapper">
            <h1>Plan your day!</h1>
            <TodoForm addTodo={addTodo} />
            {todos.map((todo, index) => (
                todo.isEditing ? (
                    <EditTodoForm editTodo={editTask} task={todo} key={index} />
                ) : (
                    <Todo task={todo} key={index} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
                )
            ))}
        </div>
    );
};
