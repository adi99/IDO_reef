import { Provider, Signer, } from "@reef-defi/evm-provider";
import { WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

const WS_URL = process.env.WS_URL || "ws://127.0.0.1:9944";
const seed = process.env.SEED;

const setup = async () => {
  
  // Return an array of all the injected sources
  // (this needs to be called first)
  const allInjected = await web3Enable('your dapp');

  const injected;
  if (allInjected[0] && allInjected[0].signer) {
    injected = allInjected[0].signer;
  }

  // Return an array of { address, meta: { name, source } }
  // (meta.source contains the name of the extension)
  const allAccounts = await web3Accounts();

  let account;
  if (allAccounts[0] && allAccounts[0].address) {
    account = allAccounts[0].address;
  }

  const provider = new Provider({
    provider: new WsProvider(WS_URL)
  });

  await provider.api.isReady;

  const signer = new Signer(provider, account, injected);

  // Claim default account
  if (!(await signer.isClaimed())) {
    console.log(
      "No claimed EVM account found -> claimed default EVM account: ",
      await signer.getAddress()
    );
    await signer.claimDefaultAccount();
  }

  return {
    signer,
    provider,
  };
};

export default setup;
