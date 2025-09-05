const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const {
  publicKey,
  createSignerFromKeypair,
  signerIdentity,
} = require("@metaplex-foundation/umi");
const {
  createMetadataAccountV3,
  findMetadataPda,
} = require("@metaplex-foundation/mpl-token-metadata");
const fs = require("fs");
const os = require("os");
const path = require("path");

// Load existing keypair
function loadKeypairFromFile(filePath) {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(os.homedir(), filePath.replace(/^~/, ""));
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(absolutePath, "utf8"))
  );
  return secretKey;
}

const SOLANA_KEYPAIR_PATH =
  process.env.SOLANA_KEYPAIR_PATH ||
  path.join(os.homedir(), ".config/solana/id.json");

async function createSolbTokenMetadata() {
  console.log(" Creating SOLB Token Metadata...\n");

  try {
    // Load token info
    const tokenInfo = JSON.parse(
      fs.readFileSync("./solbrand-token-info.json", "utf8")
    );
    const SOLB_MINT_ADDRESS = tokenInfo.mintAddress;

    // Init Umi on devnet
    const umi = createUmi("https://api.devnet.solana.com");

    // Load mint authority
    const secretKey = loadKeypairFromFile(SOLANA_KEYPAIR_PATH);
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
    const mintAuthority = createSignerFromKeypair(umi, umiKeypair);
    umi.use(signerIdentity(mintAuthority));

    console.log(" Mint Authority:", mintAuthority.publicKey.toString());

    const mint = publicKey(SOLB_MINT_ADDRESS);

    // Derive Metadata PDA
    const metadataPDA = findMetadataPda(umi, { mint });

    console.log(" Creating metadata for:", SOLB_MINT_ADDRESS);
    console.log(
      " Metadata PDA:",
      metadataPDA[0]?.toString?.() || String(metadataPDA)
    );

    // Send create metadata transaction (minimal fields are enough for Explorer)
    const tx = await createMetadataAccountV3(umi, {
      metadata: metadataPDA,
      mint,
      mintAuthority,
      payer: mintAuthority,
      updateAuthority: mintAuthority,
      data: {
        name: "SolBrand Token",
        symbol: "SOLB",
        uri: "", // Explorer will still show name/symbol without external JSON
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
      collectionDetails: null,
      isMutable: true,
    }).sendAndConfirm(umi);

    const sig = Buffer.from(tx.signature).toString("base64");
    console.log(" Metadata created! Transaction (base64):", sig);
    console.log(
      " Explorer (search by mint):",
      `https://explorer.solana.com/address/${SOLB_MINT_ADDRESS}?cluster=devnet`
    );

    // Update token info file
    tokenInfo.metadataAccount =
      metadataPDA[0]?.toString?.() || String(metadataPDA);
    tokenInfo.name = "SolBrand Token";
    tokenInfo.symbol = "SOLB";

    fs.writeFileSync(
      "./solbrand-token-info.json",
      JSON.stringify(tokenInfo, null, 2)
    );

    console.log(" Token info updated with metadata");
    console.log(
      " SOLB token now has proper metadata and won't show as 'unknown token'!"
    );
  } catch (error) {
    console.error(" Metadata creation failed:", error.message || error);
    if (String(error.message || error).includes("already in use")) {
      console.log(" Metadata already exists for this token.");
    }
  }
}

createSolbTokenMetadata();
