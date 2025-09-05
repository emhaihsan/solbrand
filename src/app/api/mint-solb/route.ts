import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import fs from 'fs';
import os from 'os';
import path from 'path';

const SOLBRAND_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_SOLBRAND_MINT_ADDRESS || "ENboCZvfVz8Rmp2LCixNpvcUZD2eLDci2x4Yjpj2v5HM"
);

// Load mint authority keypair from file system
function loadMintAuthority(): Keypair {
  try {
    const keypairPath = process.env.SOLANA_KEYPAIR_PATH || 
      path.join(os.homedir(), '.config/solana/id.json');
    
    const secretKey = Uint8Array.from(
      JSON.parse(fs.readFileSync(keypairPath, 'utf8'))
    );
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    throw new Error(`Failed to load mint authority: ${error}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userWallet, solAmount } = await request.json();

    // Validate inputs
    if (!userWallet || !solAmount || solAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    // Setup connection
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Load mint authority
    const mintAuthority = loadMintAuthority();
    console.log('🔑 Mint Authority:', mintAuthority.publicKey.toString());

    // Convert user wallet string to PublicKey
    const userPublicKey = new PublicKey(userWallet);
    console.log('👤 User Wallet:', userPublicKey.toString());

    // Get or create user's token account
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority, // Mint authority pays for account creation
      SOLBRAND_MINT,
      userPublicKey
    );

    console.log('📦 User Token Account:', userTokenAccount.address.toString());

    // Calculate SOLB amount (1 SOL = 1000 SOLB)
    const solbAmount = parseFloat(solAmount) * 1000;
    const tokenAmount = Math.floor(solbAmount * Math.pow(10, 9)); // 9 decimals
    console.log(`💰 Minting ${solbAmount} SOLB (${tokenAmount} units) to user`);

    // Mint tokens to user - THIS IS REAL BLOCKCHAIN TRANSACTION
    const signature = await mintTo(
      connection,
      mintAuthority,
      SOLBRAND_MINT,
      userTokenAccount.address,
      mintAuthority.publicKey,
      tokenAmount,
      [],
      undefined,
      TOKEN_PROGRAM_ID
    );

    console.log('✅ REAL SOLB MINTING SUCCESS! Transaction:', signature);

    // Return success response
    return NextResponse.json({
      success: true,
      signature,
      solAmount: parseFloat(solAmount),
      solbAmount,
      tokenAmount,
      userTokenAccount: userTokenAccount.address.toString(),
      mintAddress: SOLBRAND_MINT.toString(),
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: `Successfully minted ${solbAmount} SOLB tokens to your wallet!`
    });

  } catch (error) {
    console.error('❌ REAL SOLB MINTING FAILED:', error);
    
    return NextResponse.json(
      { 
        error: 'SOLB minting failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also handle GET for testing
export async function GET() {
  try {
    const mintAuthority = loadMintAuthority();
    
    return NextResponse.json({
      status: 'SOLB Token Minting API Ready',
      mintAddress: SOLBRAND_MINT.toString(),
      mintAuthority: mintAuthority.publicKey.toString(),
      network: 'devnet',
      ready: true
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'API not ready', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
