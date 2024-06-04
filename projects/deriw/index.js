const ADDRESSES = require('../helper/coreAssets.json')

const poolDataAddress = "0xc4f422973E0609478ce4fB7C73D19aD9CB123D35"
const USDTAddress = ADDRESSES.deriw.USDT;

async function deriwTVL(api) {

  // find pool for usdt
  const usdtPool = await api.call({
    abi: 'function tokenToPool(address)  view returns (address)',
    target: poolDataAddress,
    params: [USDTAddress],
  });

  if (!usdtPool ){
    return 0
  }

  // find current pool period
  const poolPeriod = await api.call({
    abi: 'function periodID(address)  view returns (uint256)',
    target: poolDataAddress,
    params: [usdtPool],
  });

  if (poolPeriod<0){
    return 0
  }

  // raed pool amount of that period
  const getFundraisingAmount = await api.call({
    abi: 'function getFundraisingAmount(address, uint256) external view returns (uint256)',
    target: poolDataAddress,
    params: [usdtPool, poolPeriod],
  });

  if (!getFundraisingAmount){
    return 0;
  }

  return { 'deriw:usdt': getFundraisingAmount } 
}

module.exports = {
  methodology: "Counts the value of token inside the fund pool.",
  start: 1717249827,
  timetravel: false,
  deriw : {
    tvl: deriwTVL
  }
};
