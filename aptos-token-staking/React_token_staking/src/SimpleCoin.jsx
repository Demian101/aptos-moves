import React, { useState } from "react";
import { Button } from "antd";
import { AptosClient, TokenClient, AptosAccount, FaucetClient, } from "aptos";

const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

const client = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

const collection = "Mokshya Collection";
const tokenname = "Mokshya Token #1";
const description = "Mokshya Token for test"
const uri = "https://github.com/mokshyaprotocol"
const tokenPropertyVersion = 0;

const token_data_id = {
    creator: '0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad',
    collection: collection,
    name: tokenname,
}
const tokenId = {
    token_data_id,
    property_version: `${tokenPropertyVersion}`,
};
const tokenClient = new TokenClient(client); // <:!:section_1b


const issue = '0x111c1ebdec15bc4f9e84cb42a4502f90243009386109c6c7e334f1e6d9c8e932::MyCoin::issue'
const register = '0x111c1ebdec15bc4f9e84cb42a4502f90243009386109c6c7e334f1e6d9c8e932::MyCoin::register'
const coinType = '0x111c1ebdec15bc4f9e84cb42a4502f90243009386109c6c7e334f1e6d9c8e932::MyCoin::USDT'
const transfer = '0x1::coin::transfer'

const create_collection_script = '0x3::token::create_collection_script'
const create_token_script = '0x3::token::create_token_script'
const opt_in_direct_transfer = '0x3::token::opt_in_direct_transfer'
const transfer_with_opt_in = '0x3::token::transfer_with_opt_in'
const create_staking = '0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad::tokenstaking::create_staking'
const stake_token = "0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad::tokenstaking::stake_token"
const claim_reward = "0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad::tokenstaking::claim_reward"
const unstake_token = "0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad::tokenstaking::unstake_token"

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


    // 重复执行： The collection already exists
    // 消耗 apt
    const create_collection = async () => {
        const transaction = {
            type: "entry_function_payload",
            function: create_collection_script,
            arguments: [collection, description, uri, 100, [false, false, false]],
            type_arguments: [],
        };

        await window.aptos.connect();
        console.log('create_collection_script', create_collection_script)
        // console.log('transaction', transaction, '\n', JSON.parse(JSON.stringify(transaction)))
        let ret = await window.aptos.signAndSubmitTransaction(JSON.parse(JSON.stringify(transaction)));
        console.log('ret.hash', ret.hash);
        setHash(ret.hash);
    }

    const create_token = async () => {
        const transaction = {
            type: "entry_function_payload",
            function: create_token_script,
            arguments: [
                collection, tokenname, description,
                5, 10, uri,
                '0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad',
                100,
                0,
                [false, false, false, false, false, false],
                ["attack", "num_of_use"],
                [[1, 2], [1, 2]],
                ["Bro", "Ho"]
            ],
            type_arguments: [],
        };
        await window.aptos.connect();
        console.log('create_token_script', create_token_script)
        // console.log('transaction', transaction, '\n', JSON.parse(JSON.stringify(transaction)))
        let ret = await window.aptos.signAndSubmitTransaction(transaction);
        console.log('ret.hash', ret.hash);
        setHash(ret.hash);
    }

    // 调用这个函数的 account： 0x111c1ebdec15bc4f9e84cb42a4502f90243009386109c6c7e334f1e6d9c8e932
    const opt_direct_transfer = async () => {
        const transaction_payload = {
            type: "entry_function_payload",
            function: opt_in_direct_transfer,
            type_arguments: [],
            arguments: [true],
        };
        await window.aptos.connect();
        let ret = await window.aptos.signAndSubmitTransaction(transaction_payload);
        console.log('ret.hash', ret.hash);
        setHash(ret.hash);
    }


    const token_transfer_handler = async () => {
        const transfer_token_payloads = {
            type: "entry_function_payload",
            function: "0x3::token::transfer_with_opt_in", // 上一步已经将 0x111 这个账户的 TokenStore 的 opt_in 设置为了 true ，可以直接向内转入 Token 了。
            type_arguments: [],
            arguments: [
                '0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad',  // from 
                collection,
                tokenname,
                tokenPropertyVersion,
                '0x111c1ebdec15bc4f9e84cb42a4502f90243009386109c6c7e334f1e6d9c8e932', // to 
                1],    // token nums
        };
        await window.aptos.connect();
        let ret = await window.aptos.signAndSubmitTransaction(transfer_token_payloads);
        console.log('ret.hash', ret.hash);
        setHash(ret.hash);
    }

    const create_staking_handler = async () => {
        const create_staking_payloads = {
            type: "entry_function_payload",
            function: create_staking,
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [1, collection, 95000000],  // 0x6d 向 staking 注入 0.95 APT ：0xc5d7f260ae8952b75a9ff69393ebbbe52d8fee1323a4fae6d32337125a1f413b
        };
        await window.aptos.connect();
        let ret = await window.aptos.signAndSubmitTransaction(create_staking_payloads);
        console.log('ret.hash', ret.hash);
        setHash(ret.hash);
    }

    const stake_token_handler = async () => {
        const stake_token_payloads = {
            type: "entry_function_payload",
            function: stake_token,
            type_arguments: [],
            arguments: [
                '0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad',  // creator_addr , 即 staking 的创建者的地址。
                collection, tokenname, tokenPropertyVersion,
                1,  // >  1 个都会报 NO_NO_TOKEN_IN_TOKEN_STORE 
                // transaction hash : 0x595910f4e5d5b946b17f36ba75ebac867960f56f826d8163c64cd7343d758a5d
            ],
        }
        await window.aptos.connect();
        let ret = await window.aptos.signAndSubmitTransaction(stake_token_payloads);
        console.log('ret.hash', ret.hash);
        setHash(ret.hash);
    }


    // Account 2 0x11 claim his profits and rewards. 
    const get_reward_handler = async () => {
        const reward_get_payloads = {
            type: "entry_function_payload",
            function: claim_reward,
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [
                collection,
                tokenname,
                '0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad' // staking pool creator . 
            ],
        };
        await window.aptos.connect();
        let ret = await window.aptos.signAndSubmitTransaction(reward_get_payloads);
        console.log('claim reward hash', ret.hash);
        setHash(ret.hash);
    }

    // Account 2 0x11 Unstake Token from staking pool.
    // 0xdbbdb155a212acfe9a0e9e64dcf42c605ec8cf2e044a8e72a9ce65d8e1ce41c8
    const unstake_token_handler = async () => {
        const unstake_token_payloads = {
            type: "entry_function_payload",
            function: unstake_token,
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [
                '0x6d32845c994fd8af2724ac85284bf628a0ecbd4be37f6599ce4161bf307554ad', // staking pool creator . 
                collection,
                tokenname,
                tokenPropertyVersion,
                1
            ],
        }
        await window.aptos.connect();
        let ret = await window.aptos.signAndSubmitTransaction(unstake_token_payloads);
        console.log('unstake token hash', ret.hash);
        setHash(ret.hash);
    }

    return (
        <div>
            <h1>Hello Staking Coin</h1>
            {/* <Button style={{ marginTop: 40, marginBottom: 40 }} onClick={connectWallet}>Connect Wallet</Button>
            <h3 style={{ marginTop: 10, marginBottom: 10 }}>{address}</h3>
            <br />
            <Button style={{ marginTop: 40, marginBottom: 40 }} onClick={issue_handle}>Issue Coin</Button>
            <br />
            <Button style={{ marginTop: 40, marginBottom: 40 }} onClick={register_handle}>Register Coin</Button>
            <br />
            <Button style={{ marginTop: 40, marginBottom: 40 }} onClick={transfer_handle}>Transfer Coin</Button> */}
            <span>Transaction Hash : </span><h3> {hash}</h3>

            <hr />
            <Button onClick={create_collection}> create_collection </Button>
            <p>Notes: can only be executed once</p>

            <Button onClick={create_token}> create_token </Button>
            <p>Notes: can only be executed once</p>

            <Button onClick={opt_direct_transfer}> SET opt_direct_transfer true</Button>
            <p>Notes: SET Account 2(0x111) - TokenData’s opt_direct_transfer `true`</p>

            <Button onClick={token_transfer_handler}> token_transfer </Button>
            <p>Notes: creator (`0x6d3`) of Staking pool transfer token to `Account 2 (0x111)`  </p>

            <Button onClick={create_staking_handler}> create_staking </Button>
            <div>Notes: can only be executed once. </div>
            <div>Error: An attempt to create a resource account on a claimed account </div><p></p>

            <Button onClick={stake_token_handler}> stake_tokens </Button>
            <div>Account 2 call it to stake token to earn aptos APT. </div><p></p>

            <Button onClick={get_reward_handler}>claim reward</Button>
            <div>Account 2 claim reward from staking creator 0x6d. </div> <p></p>

            <Button onClick={unstake_token_handler}>unstake token</Button>
            <div> retrieve the token from staking pool.</div><p></p>

        </div>
    )
}

export default SimpleCoin;