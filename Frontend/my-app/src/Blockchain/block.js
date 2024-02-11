import React,{useContext,createContext} from 'react';
import { useAddress,useContract, useContractWrite,useMetamask } from "@thirdweb-dev/react";
import {ethers} from 'ethers';

const StateContext=useContext();

export const StateContextProvider=({children})=>{
  const {contract} =useContract('0x66DDC61C1D226557B96682D7487AE5BeaC762A9d');
  const {mutateAsync:storeIPAddress}=useContractWrite(contract,'storeIPAddress');
  const connect=useMetamask();
  const storeIp=async(ip)=>{
    try{
    const data = await storeIPAddress(ip)
    }catch(e){
      console.log(e);
    }
  }
  return(
    <StateContext.Provider value={{storeIPAddress:storeIp}}>{children}</StateContext.Provider>
  )
}
export const useStateContext=()=>useContext(StateContext)