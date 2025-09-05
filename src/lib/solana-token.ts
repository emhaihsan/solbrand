import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

// SolBrand token configuration
export const SOLBRAND_TOKEN_CONFIG = {
  mintAddress: process.env.NEXT_PUBLIC_SOLBRAND_MINT_ADDRESS || '',
  decimals: 9,
  symbol: 'SOLB',
  name: 'SolBrand Token',
};

export class SolBrandTokenService {
  private connection: Connection;

  constructor(rpcUrl: string = 'https://api.devnet.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  // Get SOLB token balance for a wallet
  async getTokenBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const mintPublicKey = new PublicKey(SOLBRAND_TOKEN_CONFIG.mintAddress);
      
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );

      const tokenAccount = await getAccount(
        this.connection,
        associatedTokenAddress
      );

      return Number(tokenAccount.amount) / Math.pow(10, SOLBRAND_TOKEN_CONFIG.decimals);
    } catch (error) {
      console.log('Token account not found or error:', error);
      return 0;
    }
  }

  // Create transaction to swap SOL for SOLB tokens
  async createSwapTransaction(
    walletAddress: string,
    solAmount: number,
    swapRate: number = 1000
  ): Promise<Transaction> {
    const publicKey = new PublicKey(walletAddress);
    const mintPublicKey = new PublicKey(SOLBRAND_TOKEN_CONFIG.mintAddress);
    
    // Calculate SOLB tokens to receive
    const solbAmount = solAmount * swapRate;
    const solbAmountLamports = solbAmount * Math.pow(10, SOLBRAND_TOKEN_CONFIG.decimals);

    const transaction = new Transaction();

    // Get or create associated token account
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      publicKey
    );

    try {
      await getAccount(this.connection, associatedTokenAddress);
    } catch (error) {
      // Token account doesn't exist, create it
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey, // payer
          associatedTokenAddress, // associated token account
          publicKey, // owner
          mintPublicKey // mint
        )
      );
    }

    // For demo purposes, this would be a simple SOL transfer to a treasury
    // In production, you'd integrate with a DEX or create a proper swap program
    const treasuryAddress = new PublicKey('11111111111111111111111111111112'); // System program as placeholder
    
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: treasuryAddress,
        lamports: solAmount * LAMPORTS_PER_SOL,
      })
    );

    // Note: In a real implementation, you would:
    // 1. Use a DEX like Jupiter, Raydium, or Orca
    // 2. Or create a custom swap program
    // 3. Or use a token faucet for demo purposes

    return transaction;
  }

  // Transfer SOLB tokens between wallets
  async createTransferTransaction(
    fromWallet: string,
    toWallet: string,
    amount: number
  ): Promise<Transaction> {
    const fromPublicKey = new PublicKey(fromWallet);
    const toPublicKey = new PublicKey(toWallet);
    const mintPublicKey = new PublicKey(SOLBRAND_TOKEN_CONFIG.mintAddress);

    const fromTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      fromPublicKey
    );

    const toTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      toPublicKey
    );

    const transaction = new Transaction();

    // Create destination token account if it doesn't exist
    try {
      await getAccount(this.connection, toTokenAccount);
    } catch (error) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          fromPublicKey, // payer
          toTokenAccount, // associated token account
          toPublicKey, // owner
          mintPublicKey // mint
        )
      );
    }

    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        fromTokenAccount, // source
        toTokenAccount, // destination
        fromPublicKey, // owner
        amount * Math.pow(10, SOLBRAND_TOKEN_CONFIG.decimals) // amount in smallest units
      )
    );

    return transaction;
  }

  // Get token info
  getTokenInfo() {
    return SOLBRAND_TOKEN_CONFIG;
  }
}
