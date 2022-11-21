import React, { useState } from "react";
import { Button } from "antd";

const issue = '0x111c1ebdec15bc4f9e84cb42a4502f90243009386109c6c7e334f1e6d9c8e932::MyCoin::issue'
const register = '0x111c1ebdec15bc4f9e84cb42a4502f90243009386109c6c7e334f1e6d9c8e932::MyCoin::register'
const coinType = '0x111c1ebdec15bc4f9e84cb42a4502f90243009386109c6c7e334f1e6d9c8e932::MyCoin::USDT'
const transfer = '0x1::coin::transfer'

const stringToHex = (text) => {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(text);
    return Array.from(encoded, (i) => i.toString(16).padStart(2, "0")).join("");
}
const SimpleCoin = () => {
    const [address, setAddress] = useState("");
    const [hash, setHash] = useState("");

    const connectWallet = async () => {
        const response = await window.aptos.connect()
        console.log('response.address', response.address)
        setAddress(response.address);
    }

    const issue_handle = async () => {
        const transaction = {
            type: "entry_function_payload",
            function: issue,
            arguments: [],
            type_arguments: [],
        };
        await window.aptos.connect()
        let ret = await window.aptos.signAndSubmitTransaction(transaction);
        console.log('ret.hash: ', ret.hash);
        setHash(ret.hash);
    }

    const register_handle = async () => {
        const transaction = {
            type: "entry_function_payload",
            function: register,
            arguments: [],
            type_arguments: [],
        };
        await window.aptos.connect()
        let ret = await window.aptos.signAndSubmitTransaction(transaction);
        console.log('ret.hash', ret.hash);
        setHash(ret.hash);
    }

    const transfer_handle = async () => {
        const transaction = {
            type: "entry_function_payload",
            function: transfer,
            arguments: ["0x388182dba7affb5f71d46be6a47caeb1eea3c242196a8e127a9a67311345d239", "100000000"],
            type_arguments: [coinType],
        };
        await window.aptos.connect()
        let ret = await window.aptos.signAndSubmitTransaction(transaction);
        console.log('ret.hash', ret.hash);
        setHash(ret.hash);
    }


    return (
        <div>
            <h1>Hello SimpleCoin</h1>
            <Button style={{ marginTop: 40, marginBottom: 40 }} onClick={connectWallet}>Connect Wallet</Button>
            <br />
            <h3 style={{ marginTop: 10, marginBottom: 10 }}>{address}</h3>
            <br />
            <Button style={{ marginTop: 40, marginBottom: 40 }} onClick={issue_handle}>Issue Coin</Button>
            <br />
            <Button style={{ marginTop: 40, marginBottom: 40 }} onClick={register_handle}>Register Coin</Button>
            <br />
            <Button style={{ marginTop: 40, marginBottom: 40 }} onClick={transfer_handle}>Transfer Coin</Button>
            <h3 style={{ marginTop: 40, marginBottom: 40 }}>{hash}</h3>
        </div>
    )
}

export default SimpleCoin;