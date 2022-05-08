import Head from 'next/head'
import { useState } from 'react'
import Web3 from 'web3'
import prizeDistributorContract from '../blockchain/prizeDistributor'
import 'bulma/css/bulma.css'
import styles from '../styles/PrizeDistributor.module.css'

import bg from '../resources/bg.png'



const PrizeDistribution = () => {
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [addresses, setAddresses] = useState('')
    const [prize, setPrize] = useState(null)
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [pdContract, setPdContract] = useState(null)

    const updateAddresses = event => {
        setAddresses(event.target.value.split(','))
        console.log(addresses)
    }

    const updatePrize = event => {
        setPrize(event.target.value)
        console.log(prize)
    }

    const distributeETHHandler = async () => {
        try {
            let val = web3.utils.toWei(prize.toString(), 'ether') * addresses.length
            await pdContract.methods.distributeToAddresses(val, addresses).send({
                from: address,
                value: val
            })
            setSuccessMsg(`Distributed ${val} ETH to ${addresses.length} addresses`)
        } catch (err) {
            setError(err.message)
        }
    }

    const connectWalletHandler = async () => {
        /* check if MetaMask is available */
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                /* Request wallet connect */
                await window.ethereum.request({ method: "eth_requestAccounts" })

                /* Set web3 instance */
                web3 = new Web3(window.ethereum)
                setWeb3(web3)

                /* Get list of accounts */
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])

                /* Create local contract copy */
                const pdContract = prizeDistributorContract(web3)
                setPdContract(pdContract)
            } catch (err) {
                setError(err)
            }
        } else {
            // MetaMask not installed
            console.log("Please install MetaMask")
        }
    }

    return (

        <div className={styles.main}>
            <Head>
                <title>ETH distribution</title>
                <meta name="description" content="Eaziest way to distribute blockchain goods for your contests/giveaways" />
            </Head>
            <nav className="navbar mt-5 mb-4 ml-0 mr-0">
                <div className="navbar-brand ml-5">
                    <h1> <div className="ml-5 mr-5"> ETH distribution </div></h1>
                </div>
                <div>

                </div>
                <div className="navbar-end mt-1 mr-5">
                    <button onClick={connectWalletHandler} className="button is-primary" style={{ height: 65, width: 145 }}>{address != null ? address.substring(0, 12) + "..." : "Connect wallet"}</button>
                </div>


            </nav >
            <section>
                <div className="container ml-">
                    <h2><div>Paste your CSV text here (Without spaces)</div></h2>
                    <div className="CSVInput">
                        <input onChange={updateAddresses} className="input mt-3" type="type" placeholder="0xC55CA7b3Abb59BecA63DDD4D422bC02B173dBba6,0x68A1437782411d73AF32d5Ba4d450fD9D46aA530,..." ></input>
                    </div>
                    <div className={styles.EachWinnerPrize}>
                        <h2 className="mt-3">What's the prize for each winner? (in ETH)</h2>
                        <input onChange={updatePrize} className="input mt-3" type="type" placeholder="0.005" rows="1"></input>
                    </div>
                    <button onClick={distributeETHHandler} className="button is-primary mt-3 mb-3" style={{ height: 65, width: 290 }}>Distribute ETH to addresses</button>

                </div>
            </section >
            <section>
                <div className="container has-text-danger">
                    <p className={styles.Error}>{error}</p>
                </div>
            </section>
            <section>
                <div className="container has-text-success">
                    <p className={styles.Success}>{successMsg}</p>
                </div>
            </section>
            <style jsx>{`
                    .navbar {
                      background: rgba(255, 255, 255, 0.5);
                    }
                    p {
                      font-size: 1.5em;
                      font-weight: 700
                    }
            `}</style>
        </div >
    )
}

export default PrizeDistribution;