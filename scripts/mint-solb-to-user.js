const {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} = require("@solana/web3.js");
const {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} = require("@solana/spl-token");
const fs = require("fs");
const os = require("os");
const path = require("path");

async function mintSolbToUser(userAddress, solAmount) {
  // Load token info
  const tokenInfo = JSON.parse(
    fs.readFileSync("./solbrand-token-info.json", "utf8")
  );

  // Load authority keypair from Solana CLI
  const keypairPath = path.join(os.homedir(), ".config", "solana", "id.json");
  const secretKey = JSON.parse(fs.readFileSync(keypairPath, "utf8"));

  const connection = new Connection(clusterApiUrl("devnet"));
  const authority = Keypair.fromSecretKey(new Uint8Array(secretKey));
  const mintPublicKey = new PublicKey(tokenInfo.mintAddress);
  const userPublicKey = new PublicKey(userAddress);

  console.log("Minting SOLB tokens...");
  console.log("Authority:", authority.publicKey.toBase58());
  console.log("User:", userAddress);
  console.log("SOL Amount:", solAmount);

  try {
    // Get or create user's token account
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      authority, // payer
      mintPublicKey,
      userPublicKey
    );

    console.log("User token account:", userTokenAccount.address.toBase58());

    // Calculate SOLB amount (1 SOL = 1000 SOLB)
    const solbAmount = solAmount * 1000;
    const solbAmountLamports = solbAmount * Math.pow(10, 9);

    // Mint SOLB tokens to user
    const signature = await mintTo(
      connection,
      authority, // payer
      mintPublicKey,
      userTokenAccount.address,
      authority, // mint authority
      solbAmountLamports
    );

    console.log("✅ Minted", solbAmount, "SOLB tokens to user");
    console.log("✅ Transaction signature:", signature);

    return signature;
  } catch (error) {
    console.error("❌ Error minting tokens:", error);
    throw error;
  }
}

// Example usage
if (require.main === module) {
  const userAddress = process.argv[2];
  const solAmount = parseFloat(process.argv[3]);

  if (!userAddress || !solAmount) {
    console.log("Usage: node mint-solb-to-user.js <user_address> <sol_amount>");
    console.log(
      "Example: node mint-solb-to-user.js 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM 0.1"
    );
    process.exit(1);
  }

  mintSolbToUser(userAddress, solAmount).catch(console.error);
}

module.exports = { mintSolbToUser };
