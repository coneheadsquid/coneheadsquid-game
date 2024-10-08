import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/styles/globals.css';
import '@/styles/98.css';
import { ArweaveWalletKit } from "@arweave-wallet-kit/react";
import ArConnectStrategy from "@arweave-wallet-kit/arconnect-strategy";
import  {BrowserRouter , Routes , Route} from 'react-router-dom'
import { Navbar } from './components/Navbar';
import { Footer } from './components/footer.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  
  <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "ACCESS_PUBLIC_KEY",
          "SIGN_TRANSACTION",
          "DISPATCH",
        ],
        ensurePermissions: true,
        strategies: [new ArConnectStrategy()],
      }}
      
    >

  <BrowserRouter>
          <Navbar />
           <Routes>
         
           <Route path="/" element={<Footer/>}/>


           </Routes>
     </BrowserRouter>
     
     
    </ArweaveWalletKit>
   
  </React.StrictMode>
);
