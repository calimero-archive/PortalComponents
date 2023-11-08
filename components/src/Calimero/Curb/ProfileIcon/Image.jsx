// Forked from: rubycoptest.testnet/widget/Image

const accountId = props.accountId;
const className = props.className;
const style = props.style;
const alt = props.alt;
const fallbackUrl = props.fallbackUrl;
const thumbnail = props.thumbnail;
const componentOwnerId = props.componentOwnerId;

const [imageUrl, setImageUrl] = useState(null);
const [nftImage, setNftImage] = useState(null);
const profile = Social.getr(`${accountId}/profile`);

function toUrl(image) {
  return (
    (image.ipfs_cid
      ? `https://ipfs.near.social/ipfs/${image.ipfs_cid}`
      : image.url) || fallbackUrl
  );
}

const thumb = (imageUrl) =>
  thumbnail && imageUrl && !imageUrl.startsWith("data:image/")
    ? `https://i.near.social/${thumbnail}/${imageUrl}`
    : imageUrl;

useEffect(() => {
  const image = profile.image;
  if (image && image.nft) {
    setNftImage(image);
  } else if (image) {
    const thumbImg = thumb(toUrl(image));
    setImageUrl(thumbImg);
  } else {
    setImageUrl(fallbackUrl);
  }
}, [accountId, profile.image, fallbackUrl, thumbnail]);

return nftImage.nft.contractId && nftImage.nft.tokenId ? (
  <Widget
    src={`${componentOwnerId}/widget/Calimero.Curb.ProfileIcon.NftImage`}
    props={{
      className,
      style,
      alt,
      nft: nftImage.nft,
      thumbnail,
      fallbackUrl,
    }}
  />
) : (
  <img className={className} style={style} src={imageUrl} alt={alt} />
);
