const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");
const fs = require("fs");
const os = require("os");
const path = require("path");

async function createSolBrandToken() {
  // Connect to devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Load keypair from Solana CLI config
  let payer;
  try {
    // Default Solana CLI keypair location
    const keypairPath = path.join(os.homedir(), ".config", "solana", "id.json");
    console.log("Loading keypair from Solana CLI:", keypairPath);

    const secretKey = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
    payer = Keypair.fromSecretKey(new Uint8Array(secretKey));
    console.log("Using Solana CLI keypair:", payer.publicKey.toBase58());
  } catch (error) {
    console.log("❌ Could not load Solana CLI keypair.");
    console.log("Make sure you have Solana CLI installed and configured.");
    console.log("Run: solana-keygen new");
    return;
  }

  // Check SOL balance
  const balance = await connection.getBalance(payer.publicKey);
  const solBalance = balance / LAMPORTS_PER_SOL;

  console.log(`SOL Balance: ${solBalance} SOL`);

  if (solBalance < 0.1) {
    console.log(
      "❌ Insufficient SOL balance. Need at least 0.1 SOL for transactions."
    );
    console.log("Please fund this wallet:", payer.publicKey.toBase58());
    console.log("Run: solana airdrop 1");
    return;
  }

  console.log("✅ Sufficient balance found. Proceeding with token creation...");

  // Create mint
  console.log("Creating SolBrand token mint...");
  const mint = await createMint(
    connection,
    payer, // Payer
    payer.publicKey, // Mint authority
    payer.publicKey, // Freeze authority
    9 // Decimals (9 is standard for SPL tokens)
  );

  console.log("✅ SolBrand Token Mint Address:", mint.toBase58());

  // Create token account for the payer
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log("✅ Token Account Address:", tokenAccount.address.toBase58());

  // Mint initial supply (1 million SOLB tokens)
  const initialSupply = 1000000 * Math.pow(10, 9); // 1M tokens with 9 decimals
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer.publicKey,
    initialSupply
  );

  console.log(`✅ Minted ${initialSupply / Math.pow(10, 9)} SOLB tokens`);

  // Save token info
  const tokenInfo = {
    mintAddress: mint.toBase58(),
    tokenAccount: tokenAccount.address.toBase58(),
    authority: payer.publicKey.toBase58(),
    decimals: 9,
    initialSupply: initialSupply / Math.pow(10, 9),
    network: "devnet",
  };

  fs.writeFileSync(
    "./solbrand-token-info.json",
    JSON.stringify(tokenInfo, null, 2)
  );
  console.log("✅ Token info saved to solbrand-token-info.json");

  console.log("\n🎉 SolBrand Token deployed successfully!");
  console.log("📋 Summary:");
  console.log(`   Mint Address: ${mint.toBase58()}`);
  console.log(`   Symbol: SOLB`);
  console.log(`   Decimals: 9`);
  console.log(`   Initial Supply: 1,000,000 SOLB`);
  console.log(`   Network: Solana Devnet`);
  console.log(`   Authority: ${payer.publicKey.toBase58()}`);

  return tokenInfo;
}

createSolBrandToken().catch(console.error);
