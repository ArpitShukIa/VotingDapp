import {useEffect, useState} from "react"
import {providers} from "ethers"
import {castVote, getDeployedContract, getElectionResults, hasAlreadyVoted} from "../contractUtils"
import {useEthers} from "@usedapp/core"
import {CircularProgress} from "@mui/material";
import {Form} from "./Form";
import {Table} from "./Table";

function App() {
    const [contract, setContract] = useState(null)
    const [candidates, setCandidates] = useState([])
    const [alreadyVoted, setAlreadyVoted] = useState(false)
    const [loading, setLoading] = useState(true)

    const {account, activateBrowserWallet, deactivate, chainId} = useEthers()

    const isConnected = account !== undefined

    useEffect(() => {
        const provider = new providers.Web3Provider(window.ethereum, "any")
        provider.on("network", (newNetwork, oldNetwork) => {
            // When a Provider makes its initial connection, it emits a "network"
            // event with a null oldNetwork along with the newNetwork. So, if the
            // oldNetwork exists, it represents a changing network
            if (oldNetwork) {
                window.location.reload()
            }
        })
    }, [])

    useEffect(() => {
        if (!account || contract)
            return
        const run = async () => {
            const contract = await getDeployedContract()
            if (contract) {
                setContract(contract)
                const candidates = await getElectionResults(contract)
                setCandidates(candidates)
                setLoading(false)

                const provider = new providers.Web3Provider(window.ethereum, "any")
                const startBlockNumber = await provider.getBlockNumber();
                contract.on('votedEvent', (...args) => {
                    const event = args[args.length - 1];
                    if (event.blockNumber > startBlockNumber)
                        window.location.reload()
                })
            } else {
                console.log('Not connected to Rinkeby Test Network')
            }
        }
        run()
    }, [account, chainId])

    useEffect(() => {
        if (!account || !contract)
            return
        setAlreadyVoted(true)
        hasAlreadyVoted(contract, account).then(voted => setAlreadyVoted(voted))
    }, [account, contract])


    const vote = async (selectedCandidate) => {
        setLoading(true)
        try {
            await castVote(contract, selectedCandidate)
            setAlreadyVoted(true)
        } catch (e) {
        }
        setLoading(false)
    }

    return (
        <div className="container" style={{width: "650px"}}>
            {
                loading
                    ? <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <CircularProgress size={80}/>
                    </div>
                    : <div className="col-lg-12 mt-4">
                        {
                            isConnected ?
                                <button className="btn btn-secondary"
                                        style={{position: "absolute", right: 30}}
                                        onClick={deactivate}
                                >
                                    Disconnect
                                </button>
                                : ""
                        }
                        <h1 className="text-center">Election Results</h1>
                        <hr/>
                        <br/>
                        {
                            isConnected
                                ? <div>
                                    <Table candidates={candidates}/>
                                    {
                                        alreadyVoted ? "" : <Form candidates={candidates} vote={vote}/>
                                    }
                                    <p className="text-center">Your account: {account}</p>
                                </div>
                                : <div style={{textAlign: "center"}}>
                                    <p style={{fontSize: 20}}>Connect to your Metamask wallet</p>
                                    <button className="btn btn-primary" onClick={activateBrowserWallet}>Connect</button>
                                </div>
                        }
                    </div>
            }
        </div>
    )
}

export default App
