const {
  className: propClassName,
  style,
  alt,
  nft: propNft,
  thumbnail,
  fallbackUrl,
} = props;

const [state, setState] = useState({
  contractId: propNft?.contractId,
  tokenId: propNft?.tokenId,
  loadingUrl:
    "https://ipfs.near.social/ipfs/bafkreidoxgv2w7kmzurdnmflegkthgzaclgwpiccgztpkfdkfzb4265zuu",
  imageUrl: null,
  oldUrl: null,
});

const nftMetadata =
  propNft.contractMetadata ?? Near.view(state.contractId, "nft_metadata");
const tokenMetadata =
  propNft.tokenMetadata ??
  Near.view(state.contractId, "nft_token", {
    token_id: state.tokenId,
  }).metadata;

let imageUrl = null;

if (nftMetadata && tokenMetadata) {
  let tokenMedia = tokenMetadata.media || "";

  imageUrl =
    tokenMedia.startsWith("https://") ||
    tokenMedia.startsWith("http://") ||
    tokenMedia.startsWith("data:image")
      ? tokenMedia
      : nftMetadata.base_uri
      ? `${nftMetadata.base_uri}/${tokenMedia}`
      : tokenMedia.startsWith("Qm") || tokenMedia.startsWith("ba")
      ? `https://ipfs.near.social/ipfs/${tokenMedia}`
      : tokenMedia;

  if (!tokenMedia && tokenMetadata.reference) {
    if (
      nftMetadata.base_uri === "https://arweave.net" &&
      !tokenMetadata.reference.startsWith("https://")
    ) {
      const res = fetch(`${nftMetadata.base_uri}/${tokenMetadata.reference}`);
      imageUrl = res.body.media;
    } else if (
      tokenMetadata.reference.startsWith("https://") ||
      tokenMetadata.reference.startsWith("http://")
    ) {
      const res = fetch(tokenMetadata.reference);
      imageUrl = JSON.parse(res.body).media;
    } else if (tokenMetadata.reference.startsWith("ar://")) {
      const res = fetch(
        `${"https://arweave.net"}/${tokenMetadata.reference.split("//")[1]}`
      );
      imageUrl = JSON.parse(res.body).media;
    }
  }

  if (!imageUrl) {
    imageUrl = false;
  }
  setState((prevState) => ({
    ...prevState,
    imageUrl: imageUrl,
  }));
}

const replaceIpfs = useCallback(
  (imageUrl) => {
    const rex =
      /^(?:https?:\/\/)(?:[^\/]+\/ipfs\/)?(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(?:\.[^\/]+)?(\/.*)?$/g;

    if (state.oldUrl !== imageUrl && imageUrl) {
      const match = rex.exec(imageUrl);
      if (match) {
        const newImageUrl = `https://ipfs.near.social/ipfs/${match[1]}${
          match[2] || ""
        }`;
        if (newImageUrl !== imageUrl) {
          setState((prevState) => ({
            ...prevState,
            oldUrl: imageUrl,
            imageUrl: newImageUrl,
          }));
          return;
        }
      }
    }
    if (state.imageUrl !== false) {
      setState((prevState) => ({
        ...prevState,
        imageUrl: false,
      }));
    }
  },
  [state]
);

const thumb = (imageUrl) =>
  thumbnail && imageUrl && !imageUrl.startsWith("data:image/")
    ? `https://i.near.social/${thumbnail}/${imageUrl}`
    : imageUrl;

const img = state.imageUrl !== null ? state.imageUrl : imageUrl;
const src = img !== false ? img : fallbackUrl;

return (
  <img
    className={propClassName || "img-fluid"}
    style={style}
    src={src !== null ? thumb(src) : state.loadingUrl}
    alt={alt}
    onError={() => replaceIpfs(img)}
  />
);
