import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Crypto Distributor</title>
        <meta name="description" content="Create transparent raffles easily!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Crypto distributor
        </h1>

        <div></div>

        <div className={styles.grid}>
          <Link href="/eth">
            <a className={styles.card}>
              <h2>ETH &rarr;</h2>
              <p>Distribute your ETH to random or known addresses</p>
            </a>
          </Link>

          <Link href="/erc20">
            <a className={styles.card}>
              <h2>ERC20 tokens &rarr;</h2>
              <p>Distribute any ERC20 token to random or known addresses</p>
            </a>
          </Link>

          <Link href="/erc721">
            <a
              className={styles.card}
            >
              <h2>NFTs (ERC721) &rarr;</h2>
              <p>Manage your Non-fungible tokens there! Not currently implemented</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}
