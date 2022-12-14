
import { AptosClient,TokenClient, AptosAccount, FaucetClient, } from "aptos";


const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";


const client = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
// Creator Account
const account1 = new AptosAccount();
// Staker Account
const account2 = new AptosAccount();
const collection = "Mokshya Collection";
const tokenname = "Mokshya Token #1";
const description="Mokshya Token for test"
const uri = "https://github.com/mokshyaprotocol"
const tokenPropertyVersion = BigInt(0);

const token_data_id =  {creator: account1.address().hex(),
  collection: collection,
  name: tokenname,

}
const tokenId = {
  token_data_id,
  property_version: `${tokenPropertyVersion}`,
};
const tokenClient = new TokenClient(client); // <:!:section_1b

/**
 * Testing Staking Contract
 */
 describe("Token Staking", () => {
  it ("Create Collection", async () => {
    await faucetClient.fundAccount(account1.address(), 1000000000);//Airdropping
    const create_collection_payloads = {
      type: "entry_function_payload",
      function: "0x3::token::create_collection_script",
      type_arguments: [],
      arguments: [collection,description,uri,BigInt(100),[false, false, false]],
    };
    let txnRequest = await client.generateTransaction(account1.address(), create_collection_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account1, txnRequest);
    await client.submitSignedBCSTransaction(bcsTxn);

  });
  it ("Create Token", async () => {
    const create_token_payloads = {
      type: "entry_function_payload",
      function: "0x3::token::create_token_script",
      type_arguments: [],
      arguments: [collection,tokenname,description,BigInt(5),BigInt(10),uri,account1.address(),
        BigInt(100),BigInt(0),[ false, false, false, false, false, false ],
        [ "attack", "num_of_use"],
        [[1,2],[1,2]],
        ["Bro","Ho"]
      ],
    };
    let txnRequest = await client.generateTransaction(account1.address(), create_token_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account1, txnRequest);
    await client.submitSignedBCSTransaction(bcsTxn);
  });
  it ("Opt In Transfer ", async () => {
    await faucetClient.fundAccount(account2.address(), 1000000000);//Airdropping
    const create_token_payloads = {
      type: "entry_function_payload",
      function: "0x3::token::opt_in_direct_transfer",
      type_arguments: [],
      arguments: [true],
    };
    let txnRequest = await client.generateTransaction(account2.address(), create_token_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account2, txnRequest);
    await client.submitSignedBCSTransaction(bcsTxn);
  });
  it ("Transfer Token ", async () => {
    const create_token_payloads = {
      type: "entry_function_payload",
      function: "0x3::token::transfer_with_opt_in",
      type_arguments: [],
      arguments: [account1.address(),collection,tokenname,tokenPropertyVersion,account2.address(),BigInt(1)],
    };
    let txnRequest = await client.generateTransaction(account1.address(), create_token_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account1, txnRequest);
    await client.submitSignedBCSTransaction(bcsTxn);
  
  });
  it ("Create Staking", async () => {
    const create_staking_payloads = {
      type: "entry_function_payload",
      function: "0x71b821625cb88fed73afa9e3af5d2a3cab4b6241296a0f2e853d82f048034728::tokenstaking::create_staking",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [BigInt(1),collection,BigInt(10)
      ],
    };
    let txnRequest = await client.generateTransaction(account1.address(), create_staking_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account1, txnRequest);
    await client.submitSignedBCSTransaction(bcsTxn);
  });
  it ("Stake Token", async () => {
    const create_staking_payloads = {
      type: "entry_function_payload",
      function: "0x71b821625cb88fed73afa9e3af5d2a3cab4b6241296a0f2e853d82f048034728::tokenstaking::stake_token",
      type_arguments: [],
      arguments: [account1.address(),collection,tokenname,tokenPropertyVersion,BigInt(1)
      ],
    };
    let txnRequest = await client.generateTransaction(account2.address(), create_staking_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account2, txnRequest);
    await client.submitSignedBCSTransaction(bcsTxn);
  });
  it ("Get Reward", async () => {
    const create_staking_payloads = {
      type: "entry_function_payload",
      function: "0x71b821625cb88fed73afa9e3af5d2a3cab4b6241296a0f2e853d82f048034728::tokenstaking::claim_reward",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [collection,tokenname,account1.address()
      ],
    };
    let txnRequest = await client.generateTransaction(account2.address(), create_staking_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account2, txnRequest);
    await client.submitSignedBCSTransaction(bcsTxn);
  });
  it ("Unstake Token", async () => {
    const create_staking_payloads = {
      type: "entry_function_payload",
      function: "0x71b821625cb88fed73afa9e3af5d2a3cab4b6241296a0f2e853d82f048034728::tokenstaking::unstake_token",
      type_arguments: ["0x1::aptos_coin::AptosCoin"],
      arguments: [account1.address(),collection,tokenname,tokenPropertyVersion,1
      ],
    };
    let txnRequest = await client.generateTransaction(account2.address(), create_staking_payloads);
    let bcsTxn = AptosClient.generateBCSTransaction(account2, txnRequest);
    await client.submitSignedBCSTransaction(bcsTxn);
  });
  });
