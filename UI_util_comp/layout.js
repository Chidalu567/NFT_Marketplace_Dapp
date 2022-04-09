import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Layout = ({ children }) => {
    return (
        <div>
            <h1 className={styles.main_header}>VirualMarketPlace</h1>
            <nav>
                <ul className={styles.navbarlist}>
                    <li>
                        <Link href='/' passHref><a>Home</a></Link>
                    </li>

                    <li>
                        <Link href='/sell-item' passHref><a>Sell Digital Asset</a></Link>
                    </li>

                    <li>
                        <Link href='/my_nft' passHref><a>My Digital Asset</a></Link>
                    </li>

                    <li>
                        <Link href='/userCreateNft' passHref><a>Create Digital Asset</a></Link>
                    </li>

                    <li>
                        <Link href='/dashboard' passHref><a>Dashboard</a></Link>
                    </li>
                </ul>
            </nav>
            {children}
        </div>
    )
};

export default Layout;