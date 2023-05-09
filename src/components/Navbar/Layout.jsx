import Head from 'next/head';
import Navbar from './Navbar';
import 'bulma/css/bulma.css';


export default function Layout({children}) {
  return (
    <>
      <Head>
        <title>BookTok - Project2 </title>
      </Head>
      <Navbar className="navbar is-fixed-top"/>
      <div className="columns px-5 mt-5">
        <div className='column is-centered'>
          {children}
        </div>
      </div>
    </>
  );
}

