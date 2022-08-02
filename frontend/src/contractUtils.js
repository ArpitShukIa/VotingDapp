import TodoList from "./chain-info/contracts/Election.json"
import networkMapping from "./chain-info/deployments/map.json"
import {Contract, providers, utils} from "ethers";

export const getDeployedContract = async () => {
    const {abi} = TodoList
    const provider = new providers.Web3Provider(window.ethereum)
    const {chainId} = await provider.getNetwork()
    if (!chainId || !networkMapping[String(chainId)]) {
        return null
    }
    const electionContractAddress = networkMapping[String(chainId)]["Election"][0]
    const electionContractInterface = new utils.Interface(abi)
    const electionContract = new Contract(electionContractAddress, electionContractInterface, provider.getSigner())
    return await electionContract.deployed()
}

export const getElectionResults = async (contract) => {
    const candidates = []
    const count = await contract.candidateCount()
    const candidateCount = +utils.formatUnits(count, 0)
    for (let i = 1; i <= candidateCount; i++) {
        const {id, name, voteCount} = await contract.candidates(i)
        candidates.push({
            id: +utils.formatUnits(id, 0),
            name,
            voteCount: +utils.formatUnits(voteCount, 0)
        })
    }
    return candidates
}

export const hasAlreadyVoted = async (contract, account) => {
    return await contract.voters(account)
}

export const castVote = async (contract, candidateId) => {
    const tx = await contract.vote(candidateId)
    await tx.wait(1)
}
