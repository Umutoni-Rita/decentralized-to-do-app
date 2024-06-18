// src/web3.js
import Web3 from "web3";
import TodoListABI from "./contracts/TodoList.json";

let web3;
let todoList;

const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }

    const networkId = 5777;
    const deployedNetwork = TodoListABI.networks[networkId];
    todoList = new web3.eth.Contract(
        TodoListABI.abi,
        deployedNetwork && deployedNetwork.address
    );
};

const getWeb3 = () => web3;
const getTodoList = () => todoList;

export { initWeb3, getWeb3, getTodoList };
