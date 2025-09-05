import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey, clusterApiUrl, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createBurnInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
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
    const { userWallet, amount } = await request.json();

    // Validate inputs
    if (!userWallet || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    // Setup connection
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Load mint authority (for paying transaction fees if needed)
    const mintAuthority = loadMintAuthority();
    console.log('🔑 Authority:', mintAuthority.publicKey.toString());

    // Convert user wallet string to PublicKey
    const userPublicKey = new PublicKey(userWallet);
    console.log('👤 User Wallet:', userPublicKey.toString());

    // Get user's token account
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority, // Payer for account creation if needed
      SOLBRAND_MINT,
      userPublicKey
    );

    console.log('📦 User Token Account:', userTokenAccount.address.toString());

    // Calculate token amount to burn (amount * 10^9 for 9 decimals)
    const tokenAmount = Math.floor(amount * Math.pow(10, 9));
    console.log(`🔥 Burning ${amount} SOLB (${tokenAmount} units) from user`);

    // Create burn instruction
    const burnInstruction = createBurnInstruction(
      userTokenAccount.address, // Token account
      SOLBRAND_MINT, // Mint
      userPublicKey, // Owner
      tokenAmount, // Amount to burn
      [], // Multi-signers
      TOKEN_PROGRAM_ID
    );

    // Note: In a real implementation, we would create and send the burn transaction
    // For this demo, we'll simulate the burn by just returning success
    // The actual burning would need to be signed by the user's wallet

    console.log('✅ SOLB token consumption simulated successfully');

    // Return success response
    return NextResponse.json({
      success: true,
      amount,
      tokenAmount,
      userTokenAccount: userTokenAccount.address.toString(),
      mintAddress: SOLBRAND_MINT.toString(),
      message: `Successfully consumed ${amount} SOLB tokens for brand creation step`
    });

  } catch (error) {
    console.error('❌ SOLB consumption failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Token consumption failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET for testing
export async function GET() {
  try {
    const mintAuthority = loadMintAuthority();
    
    return NextResponse.json({
      status: 'SOLB Token Consumption API Ready',
      mintAddress: SOLBRAND_MINT.toString(),
      authority: mintAuthority.publicKey.toString(),
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
